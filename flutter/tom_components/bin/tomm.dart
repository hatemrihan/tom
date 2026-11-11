// tomm: copy a widget's source into your app, so it is yours to change.
//   dart run tomm list
//   dart run tomm add hold_to_confirm music_toggle
//   dart run tomm add result_slip --dir lib/ui --force
import 'dart:convert';
import 'dart:io';
import 'dart:isolate';
import 'dart:math';

/// Files several widgets share. They are copied when a widget needs them.
const _shared = {'tom_style', 'tom_qr', 'scroll_linked'};

/// The version of this tool, sent with anonymous usage.
const _version = '0.1.2';

/// Packages a copied widget may import, besides Flutter itself.
const _packages = ['qr', 'http'];

const _help = '''
tomm: simple, direct Flutter widgets

  dart run tomm list                     show every widget
  dart run tomm add <name> [<name> …]    copy widgets into your app
      --dir <folder>                     where to put them (default: lib/tomm)
      --force                            replace files that already exist
      --yes                              install what they need without asking
      --no-install                       never install, only say what is needed
      --no-telemetry                     send no anonymous usage (or set TOMM_TELEMETRY=0)

  Or use them without copying:           flutter pub add tomm
                                         import 'package:tomm/tomm.dart';

  Previews and docs:                     https://tomm.one/components
''';

Future<void> main(List<String> args) async {
  if (args.isEmpty || const {'help', '--help', '-h'}.contains(args.first)) {
    stdout.writeln(_help);
    return;
  }

  final uri = await Isolate.resolvePackageUri(Uri.parse('package:tomm/tomm.dart'));
  if (uri == null) {
    stderr.writeln('Could not find the tomm package. Run `flutter pub add tomm` first.');
    exitCode = 1;
    return;
  }
  final src = Directory.fromUri(uri.resolve('src/'));
  final all = [
    for (final f in src.listSync().whereType<File>())
      if (f.path.endsWith('.dart')) f.uri.pathSegments.last.replaceAll('.dart', ''),
  ].where((n) => !_shared.contains(n)).toList()..sort();

  final command = args.first;
  if (command == 'list') {
    stdout.writeln(all.join('\n'));
    return;
  }
  if (command != 'add') {
    stderr.writeln('Unknown command "$command".\n\n$_help');
    exitCode = 1;
    return;
  }

  var dir = 'lib/tomm';
  var force = false;
  var yes = false;
  var noInstall = false;
  var telemetry = Platform.environment['TOMM_TELEMETRY'] != '0' && Platform.environment['DO_NOT_TRACK'] != '1';
  final names = <String>[];
  for (var i = 1; i < args.length; i++) {
    final a = args[i];
    if (a == '--force') {
      force = true;
    } else if (a == '--yes' || a == '-y') {
      yes = true;
    } else if (a == '--no-install') {
      noInstall = true;
    } else if (a == '--no-telemetry') {
      telemetry = false;
    } else if (a == '--dir' && i + 1 < args.length) {
      dir = args[++i];
    } else {
      // accept the names used on the website too: hold-to-confirm
      names.add(a.replaceAll('-', '_'));
    }
  }
  if (names.isEmpty) {
    stderr.writeln('Say which widget to add, for example: dart run tomm add hold_to_confirm\nRun `dart run tomm list` to see them all.');
    exitCode = 1;
    return;
  }
  final unknown = names.where((n) => !all.contains(n)).toList();
  if (unknown.isNotEmpty) {
    stderr.writeln('No widget called ${unknown.map((n) => '"$n"').join(', ')}. Run `dart run tomm list` to see them all.');
    exitCode = 1;
    return;
  }

  dir = dir.replaceAll(RegExp(r'/+$'), '');
  final added = <String>[];
  final helpers = <String>[];
  final skipped = <String>[];
  final needed = <String>{};

  void copy(String name, {required bool helper}) {
    final code = File.fromUri(src.uri.resolve('$name.dart')).readAsStringSync();
    for (final p in _packages) {
      if (code.contains("import 'package:$p/")) needed.add(p);
    }
    final target = File('$dir/$name.dart');
    if (target.existsSync() && !force) {
      if (!helper && !skipped.contains(name)) skipped.add(name);
    } else {
      target.parent.createSync(recursive: true);
      target.writeAsStringSync(code);
      final list = helper ? helpers : added;
      if (!list.contains(name)) list.add(name);
    }
    // the shared files this one imports
    for (final m in RegExp(r"^import '([a-z_]+)\.dart';", multiLine: true).allMatches(code)) {
      final dep = m.group(1)!;
      if (_shared.contains(dep)) copy(dep, helper: true);
    }
  }

  for (final name in names) {
    copy(name, helper: false);
  }

  // only mention packages the app does not already list
  var pubspec = '';
  try {
    pubspec = File('pubspec.yaml').readAsStringSync();
  } on FileSystemException {
    // not in a project folder: every package counts as missing
  }
  final missing = [
    for (final p in needed)
      if (!RegExp('^\\s+$p:', multiLine: true).hasMatch(pubspec)) p,
  ];
  final installCommand = 'flutter pub add ${missing.join(' ')}';

  // colour only when a person is reading, and never when they have asked for none
  final interactive = stdout.hasTerminal && stdin.hasTerminal;
  final colour = stdout.hasTerminal && stdout.supportsAnsiEscapes && !Platform.environment.containsKey('NO_COLOR');
  String paint(String code, String text) => colour ? '\x1b[${code}m$text\x1b[0m' : text;
  String bold(String t) => paint('1', t);
  String dim(String t) => paint('2', t);
  String underline(String t) => paint('4', t);
  String green(String t) => paint('32', t);
  String yellow(String t) => paint('33', t);

  // Anonymous usage, described at tomm.one/telemetry. Started now, given a moment at the end.
  final notice = <String>[];
  final sent = telemetry ? _report(added, notice) : Future<void>.value();

  final labels = [...added, ...helpers.map((h) => '$h (shared)'), ...skipped, ...missing];
  final width = labels.fold<int>(9, (w, l) => l.length > w ? l.length : w);
  String row(String mark, String name, String detail) => '  $mark ${name.padRight(width)}   $detail';

  final lines = <String>[''];
  if (added.isNotEmpty) {
    lines
      ..add('  ${bold('▀█▀ █▀█ █▀▄▀█ █▀▄▀█')}')
      ..add('  ${bold(' █  █▄█ █ ▀ █ █ ▀ █')}   ${dim('simple and direct')}')
      ..add('');
  }
  for (final n in added) {
    lines.add(row(green('✓'), n, dim('$dir/$n.dart')));
  }
  for (final n in helpers) {
    lines.add(row(green('✓'), '$n (shared)', dim('$dir/$n.dart')));
  }
  for (final n in skipped) {
    lines.add(row(dim('·'), n, dim('already here, left alone (--force replaces it)')));
  }
  for (final p in missing) {
    lines.add(row(yellow('○'), p, dim('not installed yet')));
  }
  stdout.writeln(lines.join('\n'));

  Future<void> finish({required bool complete}) async {
    stdout.writeln(added.isEmpty ? '' : "\n  ${complete ? 'Done.' : 'Almost.'} It's your code now.\n");
    await sent;
    for (final line in notice) {
      stdout.writeln(dim(line));
    }
  }

  if (missing.isEmpty) {
    await finish(complete: true);
    return;
  }
  if (noInstall || (!interactive && !yes)) {
    // nobody to ask: say what to run and leave
    stdout.writeln('\n  Run  ${underline(installCommand)}');
    await finish(complete: false);
    return;
  }

  var go = yes;
  if (!yes) {
    stdout.write('\n  Run  ${underline(installCommand)}  now? ${dim('(Y/n)')} ');
    final answer = (stdin.readLineSync() ?? '').trim().toLowerCase();
    go = !answer.startsWith('n');
  }
  if (!go) {
    await finish(complete: false);
    return;
  }

  stdout.writeln('');
  final process = await Process.start('flutter', ['pub', 'add', ...missing], mode: ProcessStartMode.inheritStdio, runInShell: Platform.isWindows);
  if (await process.exitCode == 0) {
    stdout.writeln('\n  ${green('✓')} ${missing.join(', ')} installed');
    await finish(complete: true);
  } else {
    stdout.writeln("\n  That didn't go through. Run it yourself:  ${underline(installCommand)}");
    await finish(complete: false);
    exitCode = 1;
  }
}

/// Tells tomm.one which widgets were added. No names, paths or code.
Future<void> _report(List<String> widgets, List<String> notice) async {
  if (widgets.isEmpty) return;
  final client = HttpClient()..connectionTimeout = const Duration(milliseconds: 1500);
  try {
    final ci = Platform.environment.containsKey('CI');
    String? id;
    final home = Platform.environment['HOME'] ?? Platform.environment['USERPROFILE'];
    if (!ci && home != null) {
      final file = File('$home/.config/tomm/id');
      if (file.existsSync()) {
        id = file.readAsStringSync().trim();
      } else {
        final random = Random.secure();
        id = List.generate(16, (_) => random.nextInt(256).toRadixString(16).padLeft(2, '0')).join();
        file.parent.createSync(recursive: true);
        file.writeAsStringSync('$id\n');
        // said once, the first time
        notice
          ..add('  tomm shares anonymous usage: which widget, tool version, OS.')
          ..add('  No names, paths or code. Turn it off with TOMM_TELEMETRY=0.  tomm.one/telemetry')
          ..add('');
      }
    }
    final request = await client.postUrl(Uri.parse('https://tomm.one/api/t')).timeout(const Duration(milliseconds: 1500));
    request.headers.contentType = ContentType.json;
    request.headers.set(HttpHeaders.userAgentHeader, 'tomm-dart/$_version');
    request.write(jsonEncode({
      'kind': 'cli_add',
      'source': 'pub',
      'components': widgets,
      'id': id,
      'version': _version,
      'os': Platform.operatingSystem,
      'runtime': 'dart ${Platform.version.split('.').take(2).join('.')}',
      'manager': 'pub',
      'ci': ci,
    }));
    final response = await request.close().timeout(const Duration(milliseconds: 1500));
    await response.drain<void>();
  } on Object {
    // offline, blocked or slow: not the person's problem
  } finally {
    client.close(force: true);
  }
}
