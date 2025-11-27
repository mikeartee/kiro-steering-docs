---
title: Dart Code Quality Standards
description: Guides Kiro to write consistent, error-free Dart code for Flutter development
category: code-quality
tags:
  - dart
  - flutter
  - formatting
  - code-generation
  - express
  - nodejs
  - api
  - best-practices
inclusion: always
applicableTo:
  - api-server
requiredDependencies:
  - express
filePatterns:
  - routes/**/*.js
  - routes/**/*.ts
  - api/**/*
---

## Core Principle

**Kiro writes clean, consistently formatted Dart code that follows Flutter and Dart best practices, preventing common errors and ensuring maintainable codebases.**

## RULES

You MUST follow these rules when creating or editing Dart files:

1. You MUST use 2-space indentation and single quotes for strings (unless interpolation is needed)
2. You MUST organize imports in three groups: dart: imports first, package: imports second, relative imports last
3. You MUST use const constructors and trailing commas in Flutter widget trees
4. You MUST provide explicit type annotations for variables, functions, and parameters
5. You MUST use null safety operators and async/await properly to prevent runtime errors

## How Kiro Will Write Dart

### Code Style

**Indentation**: Always use 2 spaces for indentation (Dart standard)

```dart
// Kiro will write:
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text('Hello'),
    );
  }
}

// Not:
class MyWidget extends StatelessWidget {
    const MyWidget({super.key});

    @override
    Widget build(BuildContext context) {
        return Container(
            child: Text('Hello'),
        );
    }
}
```

**Quotes**: Use single quotes for strings, double quotes only for interpolation

```dart
// Kiro will write:
const greeting = 'Hello, World!';
const name = 'Alice';
const message = "Hello, $name!"; // Double quotes for interpolation

// Not:
const greeting = "Hello, World!";
const name = "Alice";
const message = 'Hello, $name!'; // Wrong: single quotes with interpolation
```

**Naming Conventions**: Use lowerCamelCase for variables and functions, UpperCamelCase for classes

```dart
// Kiro will write:
class UserProfile {
  final String userName;
  final int userId;

  UserProfile({required this.userName, required this.userId});

  String getUserDisplayName() {
    return userName;
  }
}

void calculateTotalPrice(double itemPrice, double taxRate) {
  final totalPrice = itemPrice + (itemPrice * taxRate);
  print(totalPrice);
}

// Not:
class userProfile {
  final String UserName;
  final int user_id;

  userProfile({required this.UserName, required this.user_id});

  String GetUserDisplayName() {
    return UserName;
  }
}

void CalculateTotalPrice(double item_price, double TaxRate) {
  final total_price = item_price + (item_price * TaxRate);
  print(total_price);
}
```

**Trailing Commas**: Use trailing commas in multi-line function calls and widget trees

Trailing commas are essential in Dart/Flutter for proper formatting. They enable `dart format` to automatically format code correctly and make version control diffs cleaner.

**When to use trailing commas:**

- After the last parameter in multi-line function calls
- After the last element in multi-line lists
- After the last widget in widget trees
- After the last argument in constructor calls

**Widget tree examples:**

```dart
// Kiro will write:
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: Text('My App'),
      actions: [
        IconButton(
          icon: Icon(Icons.search),
          onPressed: () {},
        ),
        IconButton(
          icon: Icon(Icons.settings),
          onPressed: () {},
        ),
      ],
    ),
    body: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('First'),
        Text('Second'),
        Text('Third'),
      ],
    ),
  );
}

// Not:
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: Text('My App'),
      actions: [
        IconButton(
          icon: Icon(Icons.search),
          onPressed: () {}
        ),
        IconButton(
          icon: Icon(Icons.settings),
          onPressed: () {}
        )
      ]
    ),
    body: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('First'),
        Text('Second'),
        Text('Third')
      ]
    )
  );
}
```

**Formatting benefits:**

Without trailing commas, `dart format` keeps everything on one line when possible:

```dart
// Without trailing comma - formats to single line
return Container(child: Text('Hello'));
```

With trailing commas, `dart format` maintains multi-line structure:

```dart
// With trailing comma - stays multi-line
return Container(
  child: Text('Hello'),
);
```

**Version control benefits:**

When adding a new widget, trailing commas create cleaner diffs:

```dart
// With trailing commas - only one line added in diff
children: [
  Text('First'),
  Text('Second'),
+ Text('Third'),
],

// Without trailing commas - two lines modified in diff
children: [
  Text('First'),
- Text('Second')
+ Text('Second'),
+ Text('Third')
]
```

### Import Organization

**Three-group import pattern**: Organize imports into three distinct groups separated by blank lines

Dart has a standard convention for organizing imports that makes it easy to distinguish between standard library code, external packages, and your own code. This organization improves readability and makes dependencies clear.

#### Group 1: dart: imports

These are Dart's core libraries (standard library). They come first because they're the foundation of your code.

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';
```

#### Group 2: package: imports

These are external packages from pub.dev, including Flutter itself. They come second because they're external dependencies.

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
```

#### Group 3: relative imports

These are your own project files using relative paths. They come last because they're your local code.

```dart
import '../models/user.dart';
import '../services/api_service.dart';
import '../utils/helpers.dart';
import 'widgets/custom_button.dart';
```

#### Complete example with all three groups

```dart
// Kiro will write:
// Group 1: dart: imports (standard library)
import 'dart:async';
import 'dart:convert';

// Group 2: package: imports (external packages)
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

// Group 3: relative imports (local files)
import '../models/user.dart';
import '../services/api_service.dart';
import '../utils/helpers.dart';
import 'widgets/custom_button.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HomeScreen(),
    );
  }
}

// Not:
import '../models/user.dart';
import 'package:flutter/material.dart';
import 'dart:async';
import '../services/api_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'widgets/custom_button.dart';
import 'package:provider/provider.dart';
import '../utils/helpers.dart';
```

#### Additional import rules

- **Alphabetical order**: Within each group, sort imports alphabetically
- **Blank lines**: Separate each group with a single blank line
- **No mixing**: Never mix imports from different groups
- **Consistency**: Apply this pattern to every Dart file in your project

### Flutter Widget Patterns

**StatelessWidget pattern**: Use for widgets that don't need to maintain mutable state

StatelessWidget is the foundation of Flutter UI development. It's used for widgets that receive data through their constructor and don't change over time. Following the correct pattern ensures your widgets are performant and maintainable.

**Key characteristics:**

- Immutable: All properties must be final
- Const constructor: Use const for better performance
- Build method: Override to return the widget tree
- No state: Cannot change after creation

```dart
// Kiro will write:
class UserCard extends StatelessWidget {
  const UserCard({
    super.key,
    required this.userName,
    required this.userEmail,
    this.isActive = true,
  });

  final String userName;
  final String userEmail;
  final bool isActive;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              userName,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(userEmail),
            if (isActive)
              const Chip(
                label: Text('Active'),
              ),
          ],
        ),
      ),
    );
  }
}

// Not:
class UserCard extends StatelessWidget {
  UserCard({
    Key? key,
    required this.userName,
    required this.userEmail,
    this.isActive = true,
  }) : super(key: key);

  String userName;
  String userEmail;
  bool isActive;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(userName, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text(userEmail),
            if (isActive) Chip(label: Text('Active'))
          ]
        )
      )
    );
  }
}
```

**StatefulWidget pattern**: Use for widgets that need to maintain and update mutable state

StatefulWidget is used when your widget needs to change over time based on user interaction, data updates, or other events. It consists of two classes: the widget itself (immutable) and the state class (mutable).

**Key characteristics:**

- Two classes: Widget class and State class
- Immutable widget: The widget class is still immutable
- Mutable state: The State class holds mutable data
- setState: Call to trigger rebuilds
- Lifecycle methods: Access to initState, dispose, etc.

```dart
// Kiro will write:
class CounterWidget extends StatefulWidget {
  const CounterWidget({
    super.key,
    this.initialCount = 0,
  });

  final int initialCount;

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  late int _counter;

  @override
  void initState() {
    super.initState();
    _counter = widget.initialCount;
  }

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  void _decrementCounter() {
    setState(() {
      _counter--;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Counter: $_counter',
          style: const TextStyle(fontSize: 24),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: _decrementCounter,
              child: const Icon(Icons.remove),
            ),
            const SizedBox(width: 16),
            ElevatedButton(
              onPressed: _incrementCounter,
              child: const Icon(Icons.add),
            ),
          ],
        ),
      ],
    );
  }
}

// Not:
class CounterWidget extends StatefulWidget {
  CounterWidget({Key? key, this.initialCount = 0}) : super(key: key);

  int initialCount;

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  @override
  void initState() {
    super.initState();
    _counter = widget.initialCount;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Counter: $_counter', style: TextStyle(fontSize: 24)),
        SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(onPressed: () {
              setState(() {
                _counter--;
              });
            }, child: Icon(Icons.remove)),
            SizedBox(width: 16),
            ElevatedButton(onPressed: () {
              setState(() {
                _counter++;
              });
            }, child: Icon(Icons.add))
          ]
        )
      ]
    );
  }
}
```

**Widget pattern best practices:**

- **Use const constructors**: Improves performance by allowing widget reuse
- **Mark properties as final**: Ensures immutability in both widget types
- **Use super.key**: Modern Flutter syntax for passing keys
- **Include trailing commas**: Enables proper formatting
- **Private state class**: Prefix State class name with underscore
- **Initialize in initState**: Set up state in initState, not in declarations
- **Use late for non-nullable state**: When state depends on widget properties
- **Extract methods**: Keep build method clean by extracting event handlers

### Type Annotations

**Variable type annotations**: Use explicit type declarations for clarity and type safety

Dart has powerful type inference, but explicit type annotations improve code readability, catch errors earlier, and make your intentions clear. Use explicit types for variables, especially in public APIs and when the type isn't immediately obvious.

**When to use explicit types:**

- Public API variables and properties
- Class fields and properties
- Top-level variables
- When the type isn't obvious from the initializer
- When you want to enforce a specific type

**When var/final is acceptable:**

- Local variables where type is obvious from context
- When the initializer clearly shows the type
- In short functions where the type is immediately clear

```dart
// Kiro will write:
class UserService {
  // Explicit types for class fields (always)
  final String apiUrl;
  final int timeout;
  final Map<String, String> headers;
  
  UserService({
    required this.apiUrl,
    required this.timeout,
    required this.headers,
  });
  
  // Explicit type for public method variable
  Future<User> fetchUser(int userId) async {
    // var acceptable here - type obvious from literal
    var endpoint = '/users/$userId';
    
    // Explicit type when not obvious
    final Response response = await http.get(endpoint);
    
    // var acceptable - type clear from method call
    final data = jsonDecode(response.body);
    
    // Explicit type for clarity
    final User user = User.fromJson(data);
    
    return user;
  }
}

// Top-level variables - always explicit
const int maxRetries = 3;
const String defaultTheme = 'light';
final List<String> supportedLanguages = ['en', 'es', 'fr'];

// Not:
class UserService {
  // Missing explicit types
  final apiUrl;
  var timeout;
  var headers;
  
  UserService({
    required this.apiUrl,
    required this.timeout,
    required this.headers,
  });
  
  fetchUser(userId) async {
    var endpoint = '/users/$userId';
    var response = await http.get(endpoint);
    var data = jsonDecode(response.body);
    var user = User.fromJson(data);
    return user;
  }
}

// Top-level without types
const maxRetries = 3;
var defaultTheme = 'light';
final supportedLanguages = ['en', 'es', 'fr'];
```

**Collection type annotations**: Be explicit with collection types

```dart
// Kiro will write:
final List<String> names = ['Alice', 'Bob', 'Charlie'];
final Map<String, int> scores = {'Alice': 95, 'Bob': 87};
final Set<int> uniqueIds = {1, 2, 3, 4, 5};

// Type obvious from context - var acceptable
var items = <String>['apple', 'banana', 'orange'];
var config = <String, dynamic>{'debug': true, 'port': 8080};

// Not:
final names = ['Alice', 'Bob', 'Charlie'];
final scores = {'Alice': 95, 'Bob': 87};
final uniqueIds = {1, 2, 3, 4, 5};
```

**Guidelines summary:**

- **Always explicit**: Class fields, top-level variables, public APIs
- **Prefer explicit**: When type isn't immediately obvious
- **var/final acceptable**: Local variables with obvious types from literals or method calls
- **Be consistent**: Follow the same pattern throughout your codebase

**Function type annotations**: Always specify return types and parameter types

Function signatures are contracts that define what a function accepts and returns. Explicit type annotations make these contracts clear, enable better IDE support, and catch errors at compile time rather than runtime.

**Return type specifications:**

Always specify the return type for functions and methods. This makes the function's purpose clear and helps catch errors when the implementation doesn't match the intended behavior.

```dart
// Kiro will write:
// Simple return types
String formatName(String firstName, String lastName) {
  return '$firstName $lastName';
}

int calculateSum(int a, int b) {
  return a + b;
}

bool isValid(String email) {
  return email.contains('@');
}

// void for functions that don't return a value
void printMessage(String message) {
  print(message);
}

// Future for async functions
Future<User> fetchUser(int id) async {
  final response = await http.get('/users/$id');
  return User.fromJson(response.body);
}

// Future<void> for async functions that don't return a value
Future<void> saveData(String data) async {
  await database.insert(data);
}

// Not:
formatName(firstName, lastName) {
  return '$firstName $lastName';
}

calculateSum(a, b) {
  return a + b;
}

fetchUser(id) async {
  final response = await http.get('/users/$id');
  return User.fromJson(response.body);
}
```

**Parameter type annotations:**

Always include type annotations for all parameters. This ensures type safety and makes the function's requirements explicit.

```dart
// Kiro will write:
// Required parameters with types
double calculatePrice(double basePrice, double taxRate, int quantity) {
  return basePrice * quantity * (1 + taxRate);
}

// Named parameters with types
Widget buildButton({
  required String label,
  required VoidCallback onPressed,
  Color? backgroundColor,
  double fontSize = 16.0,
}) {
  return ElevatedButton(
    onPressed: onPressed,
    style: ElevatedButton.styleFrom(
      backgroundColor: backgroundColor,
    ),
    child: Text(
      label,
      style: TextStyle(fontSize: fontSize),
    ),
  );
}

// Optional positional parameters with types
String greet(String name, [String? title]) {
  if (title != null) {
    return 'Hello, $title $name';
  }
  return 'Hello, $name';
}

// Function parameters with types
List<T> filterList<T>(List<T> items, bool Function(T) predicate) {
  return items.where(predicate).toList();
}

// Not:
calculatePrice(basePrice, taxRate, quantity) {
  return basePrice * quantity * (1 + taxRate);
}

buildButton({
  required label,
  required onPressed,
  backgroundColor,
  fontSize = 16.0,
}) {
  return ElevatedButton(
    onPressed: onPressed,
    child: Text(label),
  );
}
```

**Generic type usage:**

Use meaningful generic type parameters that clearly indicate their purpose. Generics enable type-safe reusable code.

```dart
// Kiro will write:
// Generic class with meaningful type parameter
class Repository<T> {
  final List<T> _items = [];
  
  void add(T item) {
    _items.add(item);
  }
  
  T? findById(int id) {
    // Implementation
    return null;
  }
  
  List<T> getAll() {
    return List.unmodifiable(_items);
  }
}

// Generic function with constraints
T findFirst<T extends Comparable<T>>(List<T> items) {
  if (items.isEmpty) {
    throw StateError('List is empty');
  }
  return items.reduce((a, b) => a.compareTo(b) < 0 ? a : b);
}

// Multiple generic types
Map<K, V> mergeMaps<K, V>(Map<K, V> map1, Map<K, V> map2) {
  return {...map1, ...map2};
}

// Generic with specific use case
class ApiResponse<TData> {
  final bool success;
  final TData? data;
  final String? error;
  
  ApiResponse({
    required this.success,
    this.data,
    this.error,
  });
  
  ApiResponse<TData> copyWith({
    bool? success,
    TData? data,
    String? error,
  }) {
    return ApiResponse<TData>(
      success: success ?? this.success,
      data: data ?? this.data,
      error: error ?? this.error,
    );
  }
}

// Usage with specific types
final userResponse = ApiResponse<User>(
  success: true,
  data: User(id: 1, name: 'Alice'),
);

final listResponse = ApiResponse<List<String>>(
  success: true,
  data: ['item1', 'item2'],
);

// Not:
class Repository<T> {
  final _items = [];
  
  void add(item) {
    _items.add(item);
  }
  
  findById(id) {
    return null;
  }
}

findFirst(items) {
  return items.first;
}

class ApiResponse {
  final success;
  final data;
  final error;
  
  ApiResponse({this.success, this.data, this.error});
}
```

**Function type annotations best practices:**

- **Always specify return types**: Even for void functions
- **Always specify parameter types**: For all parameters (required, optional, named)
- **Use Future<T> for async**: Make async return types explicit
- **Use meaningful generic names**: TData, TResult, TItem instead of just T when it adds clarity
- **Add type constraints**: Use extends when generics need specific capabilities
- **Document complex signatures**: Add comments for complex generic functions

### Null Safety

**Nullable type syntax**: Use Type? to indicate a value can be null

Dart's null safety system prevents null reference errors at compile time. By default, all types are non-nullable, meaning they must have a value. Use the ? suffix to explicitly allow null values.

**Key concepts:**

- **Non-nullable by default**: Types without ? cannot be null
- **Nullable types**: Add ? to allow null (e.g., String?, int?, User?)
- **Compile-time safety**: Null errors are caught before runtime
- **Explicit handling**: Must check for null before using nullable values

```dart
// Kiro will write:
// Non-nullable types (cannot be null)
String name = 'Alice';
int age = 30;
User user = User(id: 1, name: 'Bob');

// Nullable types (can be null)
String? middleName;
int? phoneNumber;
User? currentUser;

// Function with nullable parameters and return type
String? findUserEmail(int? userId) {
  if (userId == null) {
    return null;
  }
  // Find user logic
  return 'user@example.com';
}

// Class with nullable properties
class UserProfile {
  final String name;
  final String? bio;
  final String? avatarUrl;
  final int? age;
  
  UserProfile({
    required this.name,
    this.bio,
    this.avatarUrl,
    this.age,
  });
}

// Not:
// Trying to assign null to non-nullable type (compile error)
String name = null; // Error!
int age = null; // Error!

// Missing ? for nullable values
String middleName; // Error if not initialized!
User currentUser; // Error if not initialized!
```

**Null-aware operators**: Safe ways to work with nullable values

Dart provides several operators to safely handle nullable values without explicit null checks. These operators make code more concise and prevent null reference errors.

**Null-aware access operator (?.)**: Safely access properties or methods on nullable objects

```dart
// Kiro will write:
String? name;

// Safe access - returns null if name is null
int? length = name?.length;

// Chaining null-aware operators
String? email = user?.profile?.email;

// Calling methods safely
user?.updateLastLogin();

// In widget trees
Widget build(BuildContext context) {
  return Text(user?.name ?? 'Guest');
}

// Not:
// Unsafe access (compile error if name is nullable)
int length = name.length; // Error!

// Manual null check (verbose)
int? length;
if (name != null) {
  length = name.length;
}
```

**Null coalescing operator (??)**: Provide default values for null

```dart
// Kiro will write:
String? userName;

// Use default value if null
String displayName = userName ?? 'Guest';

// With expressions
int itemCount = items?.length ?? 0;

// Chaining multiple defaults
String theme = userTheme ?? appTheme ?? 'light';

// In function parameters
void greet(String? name) {
  print('Hello, ${name ?? "there"}!');
}

// In widget properties
Widget build(BuildContext context) {
  return Container(
    color: backgroundColor ?? Colors.white,
    child: Text(title ?? 'Untitled'),
  );
}

// Not:
// Verbose null check
String displayName;
if (userName != null) {
  displayName = userName;
} else {
  displayName = 'Guest';
}
```

**Null-aware assignment operator (??=)**: Assign only if null

```dart
// Kiro will write:
String? cachedData;

// Assign only if cachedData is null
cachedData ??= fetchData();

// Useful for lazy initialization
class DataService {
  List<String>? _cache;
  
  List<String> getData() {
    _cache ??= loadDataFromDatabase();
    return _cache!;
  }
}

// In state management
void updateCounter() {
  setState(() {
    _counter ??= 0;
    _counter = _counter! + 1;
  });
}

// Not:
// Verbose null check and assignment
if (cachedData == null) {
  cachedData = fetchData();
}
```

**Null assertion operator (!)**: Assert that a value is not null

The null assertion operator (!) tells Dart "I know this value is not null, trust me." Use it sparingly and only when you're absolutely certain the value cannot be null. Incorrect use will cause runtime errors.

**When to use !:**

- After explicit null checks
- When you have external guarantees the value is not null
- When working with legacy code or APIs that don't support null safety

**When NOT to use !:**

- As a quick fix for null safety errors
- When you're not certain the value is non-null
- When you can use null-aware operators instead

```dart
// Kiro will write:
// Safe use after null check
String? name = getName();
if (name != null) {
  print(name.toUpperCase()); // No ! needed, Dart knows it's non-null
}

// Safe use with certainty
class UserWidget extends StatefulWidget {
  @override
  State<UserWidget> createState() => _UserWidgetState();
}

class _UserWidgetState extends State<UserWidget> {
  User? _user;
  
  @override
  void initState() {
    super.initState();
    _user = loadUser(); // We know this always returns a user
  }
  
  @override
  Widget build(BuildContext context) {
    // Safe to use ! here because initState guarantees _user is set
    return Text(_user!.name);
  }
}

// Use with late variables
class ApiService {
  late final String apiKey;
  
  void initialize(String key) {
    apiKey = key;
  }
  
  Future<void> fetchData() async {
    // Safe to use apiKey here if initialize was called
    await http.get('/api/data', headers: {'key': apiKey});
  }
}

// Prefer null-aware operators when possible
String? email = user?.email;
String displayEmail = email ?? 'No email';

// Not:
// Dangerous use without certainty
String? name = getName();
print(name!.toUpperCase()); // Runtime error if name is null!

// Overuse as a quick fix
Widget build(BuildContext context) {
  return Text(user!.profile!.email!); // Dangerous!
}

// When null-aware operators would be better
String displayEmail = user!.email!; // Bad
String displayEmail = user?.email ?? 'No email'; // Good
```

**Late variables**: Declare non-nullable variables initialized later

The `late` keyword allows you to declare non-nullable variables that will be initialized later, but before they're used. This is useful for variables that can't be initialized in the constructor but are guaranteed to be set before use.

**When to use late:**

- Variables initialized in initState or other lifecycle methods
- Expensive computations that should be deferred
- Dependency injection scenarios
- Variables that depend on other initialization

**When NOT to use late:**

- When the variable might actually be null (use Type? instead)
- When you can initialize in the constructor
- As a workaround for null safety errors

```dart
// Kiro will write:
// Late initialization in StatefulWidget
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late final AnimationController _controller;
  late final String _userId;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    );
    _userId = loadUserId();
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) => Container(),
    );
  }
}

// Late for lazy initialization
class DataManager {
  late final List<String> _expensiveData = _loadExpensiveData();
  
  List<String> _loadExpensiveData() {
    // Only computed when first accessed
    return List.generate(1000000, (i) => 'Item $i');
  }
  
  List<String> get data => _expensiveData;
}

// Late with dependency injection
class UserService {
  late final ApiClient apiClient;
  late final DatabaseService database;
  
  void initialize(ApiClient client, DatabaseService db) {
    apiClient = client;
    database = db;
  }
  
  Future<User> getUser(int id) async {
    return await apiClient.fetchUser(id);
  }
}

// Not:
// Using late when nullable would be better
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late String? _userName; // Redundant - just use String?
  
  @override
  void initState() {
    super.initState();
    _userName = null; // If it can be null, don't use late
  }
}

// Using late as a workaround
class BadExample {
  late final String value; // Never initialized - runtime error!
  
  void doSomething() {
    print(value); // Error!
  }
}
```

**Null safety best practices:**

- **Prefer non-nullable types**: Make types nullable only when necessary
- **Use null-aware operators**: Prefer ?. and ?? over explicit null checks
- **Avoid excessive !**: Only use when you're absolutely certain
- **Use late appropriately**: For deferred initialization, not as a workaround
- **Provide defaults**: Use ?? to provide sensible default values
- **Check before use**: Always verify nullable values before accessing properties

### Async/Await Patterns

**Async function syntax**: Use async/await for asynchronous operations

Dart's async/await syntax makes asynchronous code readable and maintainable. Always use async/await instead of raw Futures with .then() callbacks. This prevents callback hell and makes error handling straightforward.

**Key concepts:**

- **async keyword**: Marks a function as asynchronous
- **await keyword**: Waits for a Future to complete
- **Future<T> return type**: All async functions return a Future
- **Sequential execution**: await pauses execution until the Future completes
- **Error propagation**: Exceptions in async functions can be caught with try-catch

```dart
// Kiro will write:
// Basic async function
Future<String> fetchUserName(int userId) async {
  final response = await http.get('/api/users/$userId');
  final data = jsonDecode(response.body);
  return data['name'] as String;
}

// Async function with multiple awaits
Future<User> loadUserProfile(int userId) async {
  final user = await fetchUser(userId);
  final preferences = await fetchPreferences(userId);
  final posts = await fetchUserPosts(userId);
  
  return User(
    id: user.id,
    name: user.name,
    preferences: preferences,
    posts: posts,
  );
}

// Async function that returns void
Future<void> saveUserData(User user) async {
  await database.insert('users', user.toJson());
  await cache.invalidate('user_${user.id}');
  print('User saved successfully');
}

// Using async in widget lifecycle
class MyWidget extends StatefulWidget {
  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  User? _user;
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    _loadUser();
  }
  
  Future<void> _loadUser() async {
    setState(() {
      _isLoading = true;
    });
    
    final user = await fetchUser(123);
    
    setState(() {
      _user = user;
      _isLoading = false;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const CircularProgressIndicator();
    }
    return Text(_user?.name ?? 'Unknown');
  }
}

// Not:
// Using .then() callbacks (harder to read)
Future<String> fetchUserName(int userId) {
  return http.get('/api/users/$userId').then((response) {
    return jsonDecode(response.body)['name'] as String;
  });
}

// Missing async keyword
Future<User> loadUserProfile(int userId) {
  final user = await fetchUser(userId); // Error: await without async!
  return user;
}

// Wrong return type
String fetchUserName(int userId) async { // Error: async must return Future!
  final response = await http.get('/api/users/$userId');
  return response.body;
}
```

**Try-catch with async/await**: Proper error handling for asynchronous code

Always wrap async operations in try-catch blocks to handle errors gracefully. This prevents unhandled exceptions from crashing your app and allows you to provide meaningful error messages to users.

**Error handling patterns:**

- **Specific exceptions**: Catch specific exception types when possible
- **Generic catch**: Use catch (e) for unexpected errors
- **Finally block**: Use for cleanup operations
- **Rethrow**: Rethrow exceptions after logging if needed
- **User feedback**: Provide clear error messages

```dart
// Kiro will write:
// Basic try-catch with async/await
Future<User> fetchUser(int userId) async {
  try {
    final response = await http.get('/api/users/$userId');
    
    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load user: ${response.statusCode}');
    }
  } catch (e) {
    print('Error fetching user: $e');
    rethrow;
  }
}

// Catching specific exceptions
Future<String> readConfigFile(String path) async {
  try {
    final file = File(path);
    return await file.readAsString();
  } on FileSystemException catch (e) {
    print('File error: ${e.message}');
    return '{}'; // Return default config
  } on FormatException catch (e) {
    print('Invalid format: ${e.message}');
    return '{}';
  } catch (e) {
    print('Unexpected error: $e');
    rethrow;
  }
}

// Using finally for cleanup
Future<void> processData() async {
  final connection = await database.connect();
  
  try {
    await connection.execute('BEGIN TRANSACTION');
    await connection.insert('data', {'value': 123});
    await connection.execute('COMMIT');
  } catch (e) {
    await connection.execute('ROLLBACK');
    print('Transaction failed: $e');
    rethrow;
  } finally {
    await connection.close();
  }
}

// Error handling in widgets
class UserProfileWidget extends StatefulWidget {
  @override
  State<UserProfileWidget> createState() => _UserProfileWidgetState();
}

class _UserProfileWidgetState extends State<UserProfileWidget> {
  User? _user;
  String? _error;
  bool _isLoading = false;
  
  Future<void> _loadUser() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    
    try {
      final user = await fetchUser(123);
      setState(() {
        _user = user;
        _isLoading = false;
      });
    } on NetworkException catch (e) {
      setState(() {
        _error = 'Network error: ${e.message}';
        _isLoading = false;
      });
    } on AuthException catch (e) {
      setState(() {
        _error = 'Authentication failed: ${e.message}';
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'An unexpected error occurred';
        _isLoading = false;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const CircularProgressIndicator();
    }
    
    if (_error != null) {
      return Column(
        children: [
          Text(_error!, style: const TextStyle(color: Colors.red)),
          ElevatedButton(
            onPressed: _loadUser,
            child: const Text('Retry'),
          ),
        ],
      );
    }
    
    return Text(_user?.name ?? 'No user');
  }
}

// Multiple async operations with error handling
Future<void> syncUserData(int userId) async {
  try {
    // Parallel operations
    final results = await Future.wait([
      fetchUser(userId),
      fetchPreferences(userId),
      fetchPosts(userId),
    ]);
    
    final user = results[0] as User;
    final preferences = results[1] as Preferences;
    final posts = results[2] as List<Post>;
    
    await saveToDatabase(user, preferences, posts);
    
  } on TimeoutException catch (e) {
    print('Operation timed out: $e');
    throw Exception('Sync failed: timeout');
  } on NetworkException catch (e) {
    print('Network error: $e');
    throw Exception('Sync failed: no connection');
  } catch (e) {
    print('Unexpected error during sync: $e');
    throw Exception('Sync failed: $e');
  }
}

// Not:
// No error handling (dangerous)
Future<User> fetchUser(int userId) async {
  final response = await http.get('/api/users/$userId');
  return User.fromJson(jsonDecode(response.body)); // Can crash!
}

// Catching everything without specifics
Future<User> fetchUser(int userId) async {
  try {
    final response = await http.get('/api/users/$userId');
    return User.fromJson(jsonDecode(response.body));
  } catch (e) {
    return User.empty(); // Silently swallowing all errors
  }
}

// Not using finally for cleanup
Future<void> processData() async {
  final connection = await database.connect();
  try {
    await connection.insert('data', {'value': 123});
    await connection.close(); // Won't run if error occurs!
  } catch (e) {
    print('Error: $e');
  }
}
```

**Async/await best practices:**

- **Always use try-catch**: Wrap async operations in error handling
- **Catch specific exceptions**: Handle known error types specifically
- **Use finally for cleanup**: Ensure resources are released
- **Provide user feedback**: Show loading states and error messages
- **Avoid blocking**: Don't use await in loops unless necessary
- **Use Future.wait**: For parallel async operations
- **Return Future<void>**: For async functions that don't return values
- **Handle timeouts**: Use .timeout() for operations that might hang

### Collection Safety

**Safe collection iteration**: Avoid common pitfalls when working with collections

Dart collections (List, Set, Map) are powerful but can cause runtime errors if not used carefully. The most common mistake is modifying a collection while iterating over it, which throws a ConcurrentModificationError.

**Safe iteration patterns:**

- **Use toList() for modifications**: Create a copy before modifying
- **Use where() for filtering**: Returns a new iterable
- **Use removeWhere()**: Safe way to remove during iteration
- **Use for-in loops**: For read-only iteration
- **Avoid indexed loops with modifications**: Can skip elements or cause errors

```dart
// Kiro will write:
// Safe removal during iteration
void removeInactiveUsers(List<User> users) {
  users.removeWhere((user) => !user.isActive);
}

// Safe filtering (creates new list)
List<User> getActiveUsers(List<User> users) {
  return users.where((user) => user.isActive).toList();
}

// Safe modification by creating a copy
void updateUserNames(List<User> users) {
  final usersToUpdate = users.toList();
  for (final user in usersToUpdate) {
    user.name = user.name.toUpperCase();
  }
}

// Safe iteration for reading
void printUserNames(List<User> users) {
  for (final user in users) {
    print(user.name);
  }
}

// Safe map transformation
List<String> getUserNames(List<User> users) {
  return users.map((user) => user.name).toList();
}

// Safe addition to a different collection
void categorizeUsers(List<User> users) {
  final activeUsers = <User>[];
  final inactiveUsers = <User>[];
  
  for (final user in users) {
    if (user.isActive) {
      activeUsers.add(user);
    } else {
      inactiveUsers.add(user);
    }
  }
}

// Not:
// Modifying collection during iteration (ConcurrentModificationError!)
void removeInactiveUsers(List<User> users) {
  for (final user in users) {
    if (!user.isActive) {
      users.remove(user); // Error!
    }
  }
}

// Removing by index in forward loop (skips elements)
void removeInactiveUsers(List<User> users) {
  for (var i = 0; i < users.length; i++) {
    if (!users[i].isActive) {
      users.removeAt(i); // Skips next element!
    }
  }
}

// Adding to collection during iteration (ConcurrentModificationError!)
void duplicateActiveUsers(List<User> users) {
  for (final user in users) {
    if (user.isActive) {
      users.add(user.copy()); // Error!
    }
  }
}
```

**Common collection pitfalls and solutions:**

#### Pitfall 1: Modifying list during for-in loop

```dart
// Wrong:
void removeNegatives(List<int> numbers) {
  for (final num in numbers) {
    if (num < 0) {
      numbers.remove(num); // ConcurrentModificationError!
    }
  }
}

// Right:
void removeNegatives(List<int> numbers) {
  numbers.removeWhere((num) => num < 0);
}
```

#### Pitfall 2: Index-based removal in forward loop

```dart
// Wrong: Skips elements after removal
void removeEvenNumbers(List<int> numbers) {
  for (var i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 == 0) {
      numbers.removeAt(i); // Next element shifts down, gets skipped
    }
  }
}

// Right: Iterate backwards
void removeEvenNumbers(List<int> numbers) {
  for (var i = numbers.length - 1; i >= 0; i--) {
    if (numbers[i] % 2 == 0) {
      numbers.removeAt(i);
    }
  }
}

// Better: Use removeWhere
void removeEvenNumbers(List<int> numbers) {
  numbers.removeWhere((num) => num % 2 == 0);
}
```

#### Pitfall 3: Null safety with collections

```dart
// Wrong: Accessing potentially empty list
String getFirstName(List<String> names) {
  return names.first; // Error if list is empty!
}

// Right: Check before accessing
String getFirstName(List<String> names) {
  if (names.isEmpty) {
    return 'Unknown';
  }
  return names.first;
}

// Better: Use firstWhere with orElse
String getFirstName(List<String> names) {
  return names.firstOrNull ?? 'Unknown';
}
```

#### Pitfall 4: Modifying map during iteration

```dart
// Wrong:
void removeEmptyValues(Map<String, String> data) {
  for (final entry in data.entries) {
    if (entry.value.isEmpty) {
      data.remove(entry.key); // ConcurrentModificationError!
    }
  }
}

// Right:
void removeEmptyValues(Map<String, String> data) {
  data.removeWhere((key, value) => value.isEmpty);
}

// Alternative: Create list of keys to remove
void removeEmptyValues(Map<String, String> data) {
  final keysToRemove = <String>[];
  
  for (final entry in data.entries) {
    if (entry.value.isEmpty) {
      keysToRemove.add(entry.key);
    }
  }
  
  for (final key in keysToRemove) {
    data.remove(key);
  }
}
```

#### Pitfall 5: Assuming list order after modifications

```dart
// Wrong: Assuming indices remain valid
void processUsers(List<User> users) {
  final adminIndex = users.indexWhere((u) => u.isAdmin);
  users.removeAt(0); // Removes first user
  final admin = users[adminIndex]; // Wrong index now!
}

// Right: Store reference, not index
void processUsers(List<User> users) {
  final admin = users.firstWhere((u) => u.isAdmin);
  users.removeAt(0);
  // Use admin reference directly
  print(admin.name);
}
```

**Collection safety best practices:**

- **Use removeWhere()**: Instead of manual removal during iteration
- **Use where().toList()**: For filtering without modifying original
- **Check isEmpty**: Before accessing first, last, or indexed elements
- **Iterate backwards**: If you must remove by index in a loop
- **Create copies**: Use toList() when you need to modify during iteration
- **Use functional methods**: map(), where(), fold() are safer than manual loops
- **Avoid index assumptions**: Don't store indices across modifications
- **Use null-safe accessors**: firstOrNull, lastOrNull instead of first, last

## What This Prevents

- **Indentation errors** that break Dart code and cause compilation failures
- **String interpolation bugs** from using single quotes with $ expressions
- **Import chaos** with scattered dependencies making code hard to navigate
- **Naming inconsistencies** that violate Dart conventions and confuse developers
- **Missing trailing commas** that prevent proper formatting and create messy diffs
- **Widget performance issues** from not using const constructors
- **Type errors** caught at runtime instead of compile time
- **Null reference errors** that crash your app unexpectedly
- **Async/await mistakes** that lead to unhandled exceptions
- **ConcurrentModificationError** from modifying collections during iteration
- **Widget lifecycle errors** from improper StatefulWidget patterns
- **State management bugs** from mutable properties in StatelessWidget
- **Memory leaks** from not disposing controllers and resources
- **Build method errors** from missing @override annotations
- **Generic type confusion** from unclear or missing type parameters
- **Late initialization errors** from accessing variables before they're set
- **Collection access errors** from assuming non-empty lists or valid indices
- **Error swallowing** from catch blocks without proper handling
- **Resource leaks** from missing finally blocks in async operations
- **Formatting inconsistencies** that make code reviews difficult

## Simple Examples

### Before/After: Comprehensive Widget Example

This example demonstrates all the key rules applied to a real Flutter widget, showing the difference between poorly formatted and properly formatted code.

```dart
// Before: Poorly formatted widget with multiple issues
import '../models/user.dart';
import 'package:flutter/material.dart';
import 'dart:async';

class userCard extends StatelessWidget {
  userCard({Key? key, required this.User, this.OnTap}): super(key: key);

  User User;
  Function? OnTap;

  @override
  Widget build(BuildContext context) {
    return Card(child: InkWell(onTap: () {
      if (OnTap != null) {
        OnTap!();
      }
    }, child: Padding(padding: EdgeInsets.all(16.0), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        CircleAvatar(child: Text(User.name[0])),
        SizedBox(width: 12),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(User.name, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          Text(User.email)
        ])
      ]),
      SizedBox(height: 8),
      if (User.bio != null) Text(User.bio!),
      SizedBox(height: 8),
      Row(children: [
        Icon(Icons.phone, size: 16),
        SizedBox(width: 4),
        Text(User.phoneNumber ?? "No phone")
      ])
    ]))));
  }
}

// After: Properly formatted widget following all rules
// Group 1: dart: imports
import 'dart:async';

// Group 2: package: imports
import 'package:flutter/material.dart';

// Group 3: relative imports
import '../models/user.dart';

class UserCard extends StatelessWidget {
  const UserCard({
    super.key,
    required this.user,
    this.onTap,
  });

  final User user;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    child: Text(user.name[0]),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.name,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(user.email),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (user.bio != null)
                Text(user.bio!),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.phone, size: 16),
                  const SizedBox(width: 4),
                  Text(user.phoneNumber ?? 'No phone'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

**What changed:**

1. **Import organization** (Requirements 2.1-2.5):
   - Grouped dart: imports first
   - Grouped package: imports second
   - Grouped relative imports last
   - Separated groups with blank lines
   - Sorted alphabetically within groups

2. **Code style** (Requirements 1.1-1.4):
   - Fixed indentation to 2 spaces consistently
   - Changed class name from `userCard` to `UserCard` (UpperCamelCase)
   - Changed property names from `User`, `OnTap` to `user`, `onTap` (lowerCamelCase)
   - Changed string quotes from double to single where appropriate

3. **Widget patterns** (Requirements 3.1-3.5):
   - Added const constructor with `super.key`
   - Changed properties to `final` (immutable)
   - Used proper type `VoidCallback?` instead of `Function?`
   - Added trailing commas throughout widget tree

4. **Type annotations** (Requirements 1.3, 1.4):
   - Explicit types for all properties
   - Proper nullable types (`VoidCallback?`, `String?`)

5. **Trailing commas** (Requirement 1.5):
   - Added trailing commas after all widget parameters
   - Enables proper formatting and cleaner diffs

6. **Const usage** (Requirement 3.3):
   - Used `const` for `EdgeInsets.all(16.0)`
   - Used `const` for `SizedBox` widgets
   - Used `const` for `TextStyle` and `Icon`

### Before/After: Import Organization Example

This example shows the difference between disorganized and properly organized imports.

```dart
// Before: Disorganized imports
import '../utils/helpers.dart';
import 'package:flutter/material.dart';
import 'dart:async';
import '../services/api_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'widgets/custom_button.dart';
import 'package:provider/provider.dart';
import '../models/user.dart';
import 'dart:io';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: HomeScreen());
  }
}

// After: Properly organized imports
// Group 1: dart: imports (standard library)
import 'dart:async';
import 'dart:convert';
import 'dart:io';

// Group 2: package: imports (external packages)
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

// Group 3: relative imports (local files)
import '../models/user.dart';
import '../services/api_service.dart';
import '../utils/helpers.dart';
import 'widgets/custom_button.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: HomeScreen(),
    );
  }
}
```

**What changed:**

1. **Three-group organization** (Requirements 2.1-2.3):
   - All `dart:` imports grouped at the top
   - All `package:` imports grouped in the middle
   - All relative imports grouped at the bottom

2. **Blank line separation** (Requirement 2.4):
   - Single blank line between each group
   - Makes groups visually distinct

3. **Alphabetical sorting** (Requirement 2.5):
   - Within each group, imports are sorted alphabetically
   - `dart:async` before `dart:convert` before `dart:io`
   - `package:flutter` before `package:http` before `package:provider`
   - `../models` before `../services` before `../utils` before local `widgets/`

4. **Bonus improvements**:
   - Added const constructor to `MyApp`
   - Added const to `MaterialApp` widget

## Customization

**This is your starting point!** This steering document provides a solid foundation for writing clean, consistent Dart code following Flutter and Dart best practices. However, every project and team has unique needs and preferences.

You can customize these rules by editing this steering document to match your project's requirements:

- **Adjust code style preferences**: Change indentation, quote styles, or naming conventions if your team has different standards
- **Modify import organization**: Adapt the grouping pattern to match your project structure
- **Extend widget patterns**: Add project-specific widget templates or patterns
- **Add custom type rules**: Include additional type annotation guidelines for your domain
- **Include framework-specific patterns**: Add rules for state management libraries (Provider, Riverpod, Bloc, etc.)
- **Add project conventions**: Include team-specific coding standards or architectural patterns
- **Customize error handling**: Extend async/await patterns with your error handling strategy
- **Add performance guidelines**: Include Flutter-specific performance optimization rules

The goal is to have a steering document that works for your team and project, ensuring Kiro generates code that fits seamlessly into your codebase.

## Optional: Validation with External Tools

Want to validate that generated Dart code follows these standards? Add these tools:

### Quick Setup (Optional)

The Dart SDK includes built-in tools for formatting and analyzing code. If you have Flutter installed, you already have these tools available.

**Check if you have Dart installed:**

```bash
dart --version
```

If you don't have Dart installed, install Flutter which includes the Dart SDK: [https://docs.flutter.dev/get-started/install](https://docs.flutter.dev/get-started/install)

### dart format (Optional)

The `dart format` tool automatically formats your Dart code according to the official Dart style guide. It handles indentation, line breaks, trailing commas, and more.

**Basic usage:**

```bash
# Format a single file
dart format lib/main.dart

# Format an entire directory
dart format lib/

# Format and write changes to files
dart format --output=write lib/

# Check formatting without making changes
dart format --output=none --set-exit-if-changed lib/
```

**What it does:**

- Enforces 2-space indentation
- Adds/removes trailing commas appropriately
- Formats widget trees for readability
- Ensures consistent spacing and line breaks
- Follows official Dart style guide

**Note**: This tool validates and formats the code after Kiro writes it, but isn't required for the steering document to work. Kiro will already follow these formatting standards.

### dart analyze (Optional)

The `dart analyze` tool performs static analysis on your Dart code, catching potential errors, type issues, and code quality problems before runtime.

**Basic usage:**

```bash
# Analyze entire project
dart analyze

# Analyze specific file
dart analyze lib/main.dart

# Analyze with fatal warnings (exit code 1 on warnings)
dart analyze --fatal-infos

# Analyze with specific rules
dart analyze --no-fatal-warnings
```

**What it checks:**

- Type safety and null safety violations
- Unused imports and variables
- Potential null reference errors
- Async/await usage issues
- Dead code and unreachable statements
- Code quality and best practices
- Flutter-specific widget issues

**Example output:**

```text
Analyzing project...

  info • Unused import • lib/main.dart:5:8 • unused_import
  warning • The parameter 'context' isn't used • lib/widgets/button.dart:12:25 • unused_element
  error • The getter 'name' isn't defined for the type 'User?' • lib/services/user_service.dart:45:15 • undefined_getter

3 issues found.
```

**Note**: This tool validates the code after Kiro writes it, but isn't required for the steering document to work. Kiro will already follow null safety and type annotation standards to prevent these issues.

### Integration with CI/CD (Optional)

You can add these tools to your continuous integration pipeline to ensure code quality:

```yaml
# Example GitHub Actions workflow
name: Dart CI

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dart-lang/setup-dart@v1
      - run: dart pub get
      - run: dart format --output=none --set-exit-if-changed .
      - run: dart analyze --fatal-infos
```

**Remember**: These external tools are optional validation steps. The steering document guides Kiro to write properly formatted, type-safe Dart code from the start, so these tools should find minimal or no issues.
