---
title: Rust Code Quality Standards
description: Guides Kiro to write safe, idiomatic Rust code following ownership, borrowing, and error handling best practices
category: code-quality
tags:
  - rust
  - formatting
  - code-generation
  - safety
  - best-practices
inclusion: always
applicableTo:
  - web-app
  - library
  - cli-tool
  - api-server
filePatterns:
  - '**/*.rs'
  - src/**/*.rs
---

## Core Principle

**Kiro writes safe, idiomatic Rust code that leverages the type system and ownership model to prevent common errors at compile time.**

## RULES

You MUST follow these rules when creating or editing Rust files:

1. You MUST use 4-space indentation and follow Rust naming conventions (snake_case for functions/variables, PascalCase for types)

2. You MUST handle errors with Result<T, E> and Option<T>, avoiding unwrap() in production code

3. You MUST use proper ownership and borrowing patterns with clear lifetimes when needed

4. You MUST implement common traits (Debug, Clone, PartialEq) for custom types

5. You MUST organize imports and modules following Rust conventions

## How Kiro Will Write Rust

### Code Style

**Indentation**: Always use 4 spaces for indentation (Rust standard)

```rust
// Kiro will write:
fn calculate_total(items: &[Item]) -> f64 {
    let mut total = 0.0;
    for item in items {
        if item.price > 0.0 {
            total += item.price;
        }
    }
    total
}

// Not:
fn calculate_total(items: &[Item]) -> f64 {
  let mut total = 0.0;
  for item in items {
    if item.price > 0.0 {
      total += item.price;
    }
  }
  total
}

```

**Naming Conventions**: Use snake_case for functions/variables, PascalCase for types, SCREAMING_SNAKE_CASE for constants

```rust
// Kiro will write:
const MAX_CONNECTIONS: usize = 100;
const DEFAULT_TIMEOUT: Duration = Duration::from_secs(30);

struct UserProfile {
    user_id: u64,
    user_name: String,
    email_address: String,
}

fn calculate_user_score(user_id: u64) -> Result<f64, ScoreError> {
    let base_score = fetch_base_score(user_id)?;
    let bonus_multiplier = 1.5;
    Ok(base_score * bonus_multiplier)
}

// Not:
const maxConnections: usize = 100;
const default_timeout: Duration = Duration::from_secs(30);

struct userProfile {
    UserID: u64,
    UserName: String,
    EmailAddress: String,
}

fn CalculateUserScore(UserID: u64) -> Result<f64, ScoreError> {
    let BaseScore = fetch_base_score(UserID)?;
    let BonusMultiplier = 1.5;
    Ok(BaseScore * BonusMultiplier)
}

```

**Trailing Commas**: Use trailing commas in multi-line function calls, struct definitions, and match arms

```rust
// Kiro will write:
let user = User {
    id: 1,
    name: String::from("Alice"),
    email: String::from("alice@example.com"),
    is_active: true,
};

fn create_connection(
    host: &str,
    port: u16,
    timeout: Duration,
) -> Result<Connection, ConnectionError> {
    Connection::new(host, port, timeout)
}

// Not:
let user = User {
    id: 1,
    name: String::from("Alice"),
    email: String::from("alice@example.com"),
    is_active: true
};

fn create_connection(
    host: &str,
    port: u16,
    timeout: Duration
) -> Result<Connection, ConnectionError> {
    Connection::new(host, port, timeout)
}

```

### Error Handling

**Result<T, E> for recoverable errors**: Use Result for operations that can fail

Rust's error handling is built around the Result type, which forces you to handle errors explicitly. This prevents silent failures and makes error paths visible in the code.

**Key concepts:**

- **Result<T, E>**: For operations that can fail with recoverable errors

- **Option<T>**: For values that might be absent

- **? operator**: For propagating errors up the call stack

- **match/if let**: For handling specific error cases

- **Custom error types**: For domain-specific errors

```rust
// Kiro will write:
use std::fs::File;
use std::io::{self, Read};

fn read_config_file(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn parse_user_id(input: &str) -> Result<u64, std::num::ParseIntError> {
    input.parse::<u64>()
}

fn load_user(user_id: u64) -> Result<User, UserError> {
    let data = fetch_user_data(user_id)?;
    let user = User::from_data(data)?;
    Ok(user)
}

// Not:
fn read_config_file(path: &str) -> String {
    let mut file = File::open(path).unwrap(); // Panics on error!
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();
    contents
}

fn parse_user_id(input: &str) -> u64 {
    input.parse::<u64>().expect("Invalid user ID") // Panics!
}

```

**Option<T> for optional values**: Use Option when a value might be absent

```rust
// Kiro will write:
fn find_user_by_email(email: &str) -> Option<User> {
    // Search logic
    if let Some(user) = database.find(email) {
        Some(user)
    } else {
        None
    }
}

fn get_user_name(user: &Option<User>) -> String {
    user.as_ref()
        .map(|u| u.name.clone())
        .unwrap_or_else(|| String::from("Guest"))
}

fn process_optional_value(value: Option<i32>) -> i32 {
    match value {
        Some(v) => v * 2,
        None => 0,
    }
}

// Not:
fn find_user_by_email(email: &str) -> User {
    database.find(email).unwrap() // Panics if not found!
}

fn get_user_name(user: &Option<User>) -> String {
    user.as_ref().unwrap().name.clone() // Panics if None!
}

```

**Custom error types**: Define domain-specific errors with proper implementations

```rust
// Kiro will write:
use std::fmt;

# [derive(Debug)]
enum UserError {
    NotFound(u64),
    InvalidEmail(String),
    DatabaseError(String),
}

impl fmt::Display for UserError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            UserError::NotFound(id) => write!(f, "User with ID {} not found", id),
            UserError::InvalidEmail(email) => write!(f, "Invalid email: {}", email),
            UserError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
        }
    }
}

impl std::error::Error for UserError {}

fn validate_and_create_user(email: &str) -> Result<User, UserError> {
    if !email.contains('@') {
        return Err(UserError::InvalidEmail(email.to_string()));
    }
    
    let user = User::new(email);
    Ok(user)
}

// Not:
fn validate_and_create_user(email: &str) -> User {
    if !email.contains('@') {
        panic!("Invalid email!"); // Don't panic for recoverable errors!
    }
    User::new(email)
}

```

**The ? operator**: Use for clean error propagation

```rust
// Kiro will write:
fn load_and_process_user(user_id: u64) -> Result<ProcessedUser, UserError> {
    let user = fetch_user(user_id)?;
    let profile = fetch_profile(user_id)?;
    let preferences = fetch_preferences(user_id)?;
    
    Ok(ProcessedUser {
        user,
        profile,
        preferences,
    })
}

fn read_and_parse_config(path: &str) -> Result<Config, ConfigError> {
    let contents = std::fs::read_to_string(path)
        .map_err(|e| ConfigError::IoError(e))?;
    
    let config: Config = serde_json::from_str(&contents)
        .map_err(|e| ConfigError::ParseError(e))?;
    
    Ok(config)
}

// Not:
fn load_and_process_user(user_id: u64) -> Result<ProcessedUser, UserError> {
    let user = match fetch_user(user_id) {
        Ok(u) => u,
        Err(e) => return Err(e),
    };
    let profile = match fetch_profile(user_id) {
        Ok(p) => p,
        Err(e) => return Err(e),
    };
    // Verbose and repetitive
    Ok(ProcessedUser { user, profile })
}

```

### Ownership and Borrowing

**Ownership rules**: Follow Rust's ownership model to prevent memory errors

Rust's ownership system is its most distinctive feature, preventing data races and memory errors at compile time. Understanding when to move, borrow, or clone is essential for writing idiomatic Rust.

**Key concepts:**

- **Ownership**: Each value has a single owner

- **Move semantics**: Ownership transfers by default

- **Borrowing**: Temporary access without ownership transfer

- **Immutable borrows (&T)**: Multiple readers allowed

- **Mutable borrows (&mut T)**: Exclusive write access

- **Lifetimes**: Ensure references remain valid

```rust
// Kiro will write:
// Taking ownership
fn process_data(data: Vec<u8>) -> Vec<u8> {
    // data is moved into this function
    let mut processed = data;
    processed.push(0);
    processed // ownership transferred to caller
}

// Borrowing immutably
fn calculate_sum(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}

// Borrowing mutably
fn append_suffix(text: &mut String, suffix: &str) {
    text.push_str(suffix);
}

// Using both patterns appropriately
fn main() {
    let data = vec![1, 2, 3];
    let sum = calculate_sum(&data); // Borrow, data still usable
    println!("Sum: {}", sum);
    
    let processed = process_data(data); // Move, data no longer usable
    println!("Processed: {:?}", processed);
}

// Not:
fn calculate_sum(numbers: Vec<i32>) -> i32 {
    numbers.iter().sum() // Takes ownership unnecessarily
}

fn append_suffix(text: String, suffix: &str) -> String {
    let mut result = text; // Unnecessary move and return
    result.push_str(suffix);
    result
}

```

**Clone when necessary**: Use clone() explicitly when you need ownership of borrowed data

```rust
// Kiro will write:
# [derive(Clone, Debug)]
struct User {
    id: u64,
    name: String,
}

fn cache_user(user: &User, cache: &mut HashMap<u64, User>) {
    cache.insert(user.id, user.clone()); // Explicit clone
}

fn get_user_names(users: &[User]) -> Vec<String> {
    users.iter()
        .map(|u| u.name.clone())
        .collect()
}

// Not:
fn cache_user(user: User, cache: &mut HashMap<u64, User>) {
    cache.insert(user.id, user); // Takes ownership, user unusable after
}

```

**Lifetime annotations**: Use explicit lifetimes when the compiler needs help

```rust
// Kiro will write:
// Simple lifetime - return reference tied to input
fn first_word<'a>(text: &'a str) -> &'a str {
    text.split_whitespace().next().unwrap_or("")
}

// Multiple lifetimes - return tied to one input
fn longest<'a>(x: &'a str, y: &str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

// Struct with lifetime - holds a reference
struct UserView<'a> {
    name: &'a str,
    email: &'a str,
}

impl<'a> UserView<'a> {
    fn new(name: &'a str, email: &'a str) -> Self {
        UserView { name, email }
    }
    
    fn display(&self) -> String {
        format!("{} <{}>", self.name, self.email)
    }
}

// Not:
fn first_word(text: &str) -> &str {
    // Missing lifetime when needed
    text.split_whitespace().next().unwrap_or("")
}

struct UserView {
    name: &str, // Error: missing lifetime
    email: &str,
}

```

**Borrowing best practices**: Follow the borrowing rules to avoid compiler errors

```rust
// Kiro will write:
fn update_and_read(data: &mut Vec<i32>) {
    // Mutable borrow scope
    data.push(42);
    data.push(43);
    // Mutable borrow ends here
    
    // Immutable borrow scope
    let sum: i32 = data.iter().sum();
    println!("Sum: {}", sum);
}

fn process_items(items: &mut Vec<Item>) {
    // Process in place
    for item in items.iter_mut() {
        item.process();
    }
}

// Not:
fn update_and_read(data: &mut Vec<i32>) {
    data.push(42);
    let sum: i32 = data.iter().sum(); // Error: can't borrow as immutable
    data.push(43); // while borrowed as mutable
}

fn process_items(items: &mut Vec<Item>) {
    for item in items.iter() { // Immutable iterator
        item.process(); // Error: can't call mutable method
    }
}

```

### Pattern Matching

**Exhaustive match statements**: Handle all cases explicitly

Pattern matching is one of Rust's most powerful features. The compiler ensures you handle all possible cases, preventing bugs from unhandled scenarios.

**Key concepts:**

- **match expressions**: Exhaustive pattern matching

- **if let**: Convenient for single-pattern matching

- **while let**: Loop while pattern matches

- **Destructuring**: Extract values from complex types

- **Guards**: Add conditions to patterns

```rust
// Kiro will write:
enum Status {
    Active,
    Inactive,
    Pending,
    Suspended,
}

fn handle_status(status: Status) -> String {
    match status {
        Status::Active => String::from("User is active"),
        Status::Inactive => String::from("User is inactive"),
        Status::Pending => String::from("User is pending approval"),
        Status::Suspended => String::from("User is suspended"),
    }
}

fn process_result(result: Result<i32, String>) -> i32 {
    match result {
        Ok(value) => value,
        Err(error) => {
            eprintln!("Error: {}", error);
            0
        }
    }
}

fn get_value_or_default(option: Option<i32>) -> i32 {
    match option {
        Some(value) => value,
        None => 42,
    }
}

// Not:
fn handle_status(status: Status) -> String {
    match status {
        Status::Active => String::from("User is active"),
        Status::Inactive => String::from("User is inactive"),
        // Missing cases - won't compile!
    }
}

```

**if let for simple patterns**: Use when you only care about one case

```rust
// Kiro will write:
fn process_optional_user(user: Option<User>) {
    if let Some(u) = user {
        println!("Processing user: {}", u.name);
        u.process();
    }
}

fn handle_ok_result(result: Result<String, Error>) {
    if let Ok(value) = result {
        println!("Success: {}", value);
    }
}

// With else clause
fn get_user_name(user: Option<User>) -> String {
    if let Some(u) = user {
        u.name
    } else {
        String::from("Guest")
    }
}

// Not:
fn process_optional_user(user: Option<User>) {
    match user {
        Some(u) => {
            println!("Processing user: {}", u.name);
            u.process();
        }
        None => {} // Verbose for simple case
    }
}

```

**Destructuring patterns**: Extract values from structs and tuples

```rust
// Kiro will write:
struct Point {
    x: i32,
    y: i32,
}

fn describe_point(point: Point) -> String {
    match point {
        Point { x: 0, y: 0 } => String::from("Origin"),
        Point { x: 0, y } => format!("On Y axis at {}", y),
        Point { x, y: 0 } => format!("On X axis at {}", x),
        Point { x, y } => format!("Point at ({}, {})", x, y),
    }
}

fn process_tuple(data: (i32, String, bool)) {
    let (id, name, active) = data;
    println!("ID: {}, Name: {}, Active: {}", id, name, active);
}

enum Message {
    Text(String),
    Number(i32),
    Coordinate { x: i32, y: i32 },
}

fn handle_message(msg: Message) {
    match msg {
        Message::Text(content) => println!("Text: {}", content),
        Message::Number(n) => println!("Number: {}", n),
        Message::Coordinate { x, y } => println!("Coordinate: ({}, {})", x, y),
    }
}

// Not:
fn describe_point(point: Point) -> String {
    if point.x == 0 && point.y == 0 {
        String::from("Origin")
    } else if point.x == 0 {
        format!("On Y axis at {}", point.y)
    } else {
        format!("Point at ({}, {})", point.x, point.y)
    }
}

```

**Match guards**: Add conditions to patterns

```rust
// Kiro will write:
fn categorize_number(n: i32) -> &'static str {
    match n {
        x if x < 0 => "negative",
        0 => "zero",
        x if x < 10 => "small positive",
        x if x < 100 => "medium positive",
        _ => "large positive",
    }
}

fn process_user(user: Option<User>) {
    match user {
        Some(u) if u.is_admin => println!("Admin user: {}", u.name),
        Some(u) if u.is_active => println!("Active user: {}", u.name),
        Some(u) => println!("Inactive user: {}", u.name),
        None => println!("No user"),
    }
}

// Not:
fn categorize_number(n: i32) -> &'static str {
    if n < 0 {
        "negative"
    } else if n == 0 {
        "zero"
    } else if n < 10 {
        "small positive"
    } else {
        "large positive"
    }
}

```

### Trait Implementations

**Common traits**: Implement Debug, Clone, PartialEq for custom types

Traits define shared behavior in Rust. Implementing common traits makes your types work seamlessly with the standard library and enables useful functionality like printing, comparison, and cloning.

**Key traits to implement:**

- **Debug**: For debugging output with {:?}

- **Clone**: For explicit copying

- **PartialEq/Eq**: For equality comparison

- **PartialOrd/Ord**: For ordering

- **Default**: For default values

- **Display**: For user-facing output

```rust
// Kiro will write:
use std::fmt;

# [derive(Debug, Clone, PartialEq)]
struct User {
    id: u64,
    name: String,
    email: String,
}

impl User {
    fn new(id: u64, name: String, email: String) -> Self {
        User { id, name, email }
    }
}

impl fmt::Display for User {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} <{}>", self.name, self.email)
    }
}

impl Default for User {
    fn default() -> Self {
        User {
            id: 0,
            name: String::from("Guest"),
            email: String::from("guest@example.com"),
        }
    }
}

// Not:
struct User {
    id: u64,
    name: String,
    email: String,
}

// Missing derives - can't debug print, clone, or compare

```

**Custom trait implementations**: Implement traits for domain-specific behavior

```rust
// Kiro will write:
trait Validate {
    fn is_valid(&self) -> bool;
    fn validation_errors(&self) -> Vec<String>;
}

impl Validate for User {
    fn is_valid(&self) -> bool {
        !self.name.is_empty() && self.email.contains('@')
    }
    
    fn validation_errors(&self) -> Vec<String> {
        let mut errors = Vec::new();
        
        if self.name.is_empty() {
            errors.push(String::from("Name cannot be empty"));
        }
        
        if !self.email.contains('@') {
            errors.push(String::from("Invalid email format"));
        }
        
        errors
    }
}

trait Processable {
    type Output;
    fn process(&self) -> Self::Output;
}

impl Processable for User {
    type Output = ProcessedUser;
    
    fn process(&self) -> Self::Output {
        ProcessedUser {
            id: self.id,
            display_name: self.name.to_uppercase(),
        }
    }
}

// Not:
impl Validate for User {
    fn is_valid(&self) -> bool {
        !self.name.is_empty() && self.email.contains('@')
    }
    // Missing required method - won't compile!
}

```

**Trait bounds**: Use trait bounds for generic functions

```rust
// Kiro will write:
use std::fmt::Display;

fn print_value<T: Display>(value: T) {
    println!("Value: {}", value);
}

fn compare_values<T: PartialOrd>(a: T, b: T) -> bool {
    a > b
}

// Multiple trait bounds
fn process_and_print<T: Clone + Display>(value: T) {
    let cloned = value.clone();
    println!("Original: {}", value);
    println!("Cloned: {}", cloned);
}

// Where clause for complex bounds
fn complex_function<T, U>(t: T, u: U) -> String
where
    T: Display + Clone,
    U: Debug + PartialEq,
{
    format!("T: {}, U: {:?}", t, u)
}

// Not:
fn print_value<T>(value: T) {
    println!("Value: {}", value); // Error: T doesn't implement Display
}

fn compare_values<T>(a: T, b: T) -> bool {
    a > b // Error: T doesn't implement PartialOrd
}

```

### Module Organization

**Module structure**: Organize code with clear module boundaries

Rust's module system helps organize code into logical units. Proper module organization makes code easier to navigate and maintains clear boundaries between components.

**Key concepts:**

- **mod declarations**: Define modules

- **pub visibility**: Control what's public

- **use statements**: Import items

- **Crate organization**: lib.rs and main.rs structure

```rust
// Kiro will write:
// src/lib.rs
pub mod models;
pub mod services;
pub mod utils;

pub use models::User;
pub use services::UserService;

// src/models/mod.rs
mod user;
mod profile;

pub use user::User;
pub use profile::Profile;

// src/models/user.rs
# [derive(Debug, Clone)]
pub struct User {
    id: u64,
    name: String,
}

impl User {
    pub fn new(id: u64, name: String) -> Self {
        User { id, name }
    }
    
    pub fn id(&self) -> u64 {
        self.id
    }
}

// src/services/user_service.rs
use crate::models::User;

pub struct UserService {
    users: Vec<User>,
}

impl UserService {
    pub fn new() -> Self {
        UserService { users: Vec::new() }
    }
    
    pub fn add_user(&mut self, user: User) {
        self.users.push(user);
    }
}

// Not:
// Everything in one file or poorly organized modules

```

**Import organization**: Group and organize use statements

```rust
// Kiro will write:
// External crates first
use serde::{Deserialize, Serialize};
use tokio::runtime::Runtime;

// Standard library
use std::collections::HashMap;
use std::fs::File;
use std::io::{self, Read};

// Crate modules
use crate::models::{User, Profile};
use crate::services::UserService;
use crate::utils::validate_email;

// Not:
use crate::models::User;
use std::collections::HashMap;
use serde::Serialize;
use crate::services::UserService;
use std::fs::File;
use tokio::runtime::Runtime;

```

**Visibility modifiers**: Use pub appropriately for API boundaries

```rust
// Kiro will write:
pub struct User {
    id: u64,              // Private by default
    pub name: String,     // Public field
    email: String,        // Private field
}

impl User {
    pub fn new(id: u64, name: String, email: String) -> Self {
        User { id, name, email }
    }
    
    pub fn id(&self) -> u64 {
        self.id
    }
    
    pub fn email(&self) -> &str {
        &self.email
    }
    
    fn validate(&self) -> bool {
        // Private method
        !self.name.is_empty() && self.email.contains('@')
    }
}

// Not:
pub struct User {
    pub id: u64,          // Exposing internal ID
    pub name: String,
    pub email: String,    // No validation possible
}

```

## What This Prevents

- **Memory safety errors** from incorrect ownership and borrowing

- **Null pointer errors** by using Option<T> instead of null

- **Unhandled errors** by enforcing Result<T, E> handling

- **Runtime panics** from unwrap() in production code

- **Data races** through the borrow checker

- **Type confusion** with strong static typing

- **Missing match cases** through exhaustive pattern matching

- **Lifetime errors** with explicit lifetime annotations

- **API misuse** through proper visibility controls

- **Code organization issues** with clear module structure

- **Trait implementation gaps** by deriving common traits

- **Generic type errors** with proper trait bounds

- **Formatting inconsistencies** that violate Rust conventions

## Simple Examples

### Before/After: Comprehensive API Example

This example demonstrates all the key rules applied to a real Rust API, showing the difference between poorly written and idiomatic Rust code.

```rust
// Before: Poorly written Rust with multiple issues
use std::collections::HashMap;

struct user {
    ID: u64,
    Name: String,
    Email: String,
}

impl user {
    fn New(ID: u64, Name: String, Email: String) -> user {
        user { ID, Name, Email }
    }
    
    fn GetName(&self) -> String {
        self.Name.clone()
    }
}

struct UserService {
    Users: HashMap<u64, user>
}

impl UserService {
    fn New() -> UserService {
        UserService { Users: HashMap::new() }
    }
    
    fn AddUser(&mut self, User: user) {
        self.Users.insert(User.ID, User);
    }
    
    fn GetUser(&self, ID: u64) -> user {
        self.Users.get(&ID).unwrap().clone()
    }
    
    fn UpdateEmail(&mut self, ID: u64, Email: String) {
        let User = self.Users.get_mut(&ID).unwrap();
        User.Email = Email;
    }
}

// After: Idiomatic Rust following all rules
use std::collections::HashMap;
use std::fmt;

# [derive(Debug, Clone, PartialEq)]
pub struct User {
    id: u64,
    name: String,
    email: String,
}

impl User {
    pub fn new(id: u64, name: String, email: String) -> Result<Self, UserError> {
        if name.is_empty() {
            return Err(UserError::InvalidName);
        }
        
        if !email.contains('@') {
            return Err(UserError::InvalidEmail(email));
        }
        
        Ok(User { id, name, email })
    }
    
    pub fn id(&self) -> u64 {
        self.id
    }
    
    pub fn name(&self) -> &str {
        &self.name
    }
    
    pub fn email(&self) -> &str {
        &self.email
    }
    
    pub fn update_email(&mut self, email: String) -> Result<(), UserError> {
        if !email.contains('@') {
            return Err(UserError::InvalidEmail(email));
        }
        self.email = email;
        Ok(())
    }
}

impl fmt::Display for User {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} <{}>", self.name, self.email)
    }
}

# [derive(Debug)]
pub enum UserError {
    NotFound(u64),
    InvalidName,
    InvalidEmail(String),
}

impl fmt::Display for UserError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            UserError::NotFound(id) => write!(f, "User with ID {} not found", id),
            UserError::InvalidName => write!(f, "User name cannot be empty"),
            UserError::InvalidEmail(email) => write!(f, "Invalid email: {}", email),
        }
    }
}

impl std::error::Error for UserError {}

# [derive(Debug, Default)]
pub struct UserService {
    users: HashMap<u64, User>,
}

impl UserService {
    pub fn new() -> Self {
        UserService {
            users: HashMap::new(),
        }
    }
    
    pub fn add_user(&mut self, user: User) {
        self.users.insert(user.id(), user);
    }
    
    pub fn get_user(&self, id: u64) -> Option<&User> {
        self.users.get(&id)
    }
    
    pub fn get_user_mut(&mut self, id: u64) -> Option<&mut User> {
        self.users.get_mut(&id)
    }
    
    pub fn update_email(&mut self, id: u64, email: String) -> Result<(), UserError> {
        match self.users.get_mut(&id) {
            Some(user) => user.update_email(email),
            None => Err(UserError::NotFound(id)),
        }
    }
    
    pub fn remove_user(&mut self, id: u64) -> Option<User> {
        self.users.remove(&id)
    }
    
    pub fn user_count(&self) -> usize {
        self.users.len()
    }
}

```

**What changed:**

1. **Naming conventions** (Rule 1):
   - Changed `user` to `User` (PascalCase for types)
   - Changed `ID`, `Name`, `Email` to `id`, `name`, `email` (snake_case for fields)
   - Changed `New`, `GetName`, `AddUser` to `new`, `name`, `add_user` (snake_case for methods)

2. **Error handling** (Rule 2):
   - Replaced `unwrap()` with proper Result and Option returns
   - Created custom `UserError` enum for domain-specific errors
   - Used `?` operator for error propagation
   - Validation in constructors returns Result

3. **Ownership and borrowing** (Rule 3):
   - Changed `GetName` to return `&str` instead of cloning
   - Used references in getter methods
   - Proper mutable borrowing in `update_email`
   - Separated `get_user` and `get_user_mut` for different access patterns

4. **Trait implementations** (Rule 4):
   - Added `#[derive(Debug, Clone, PartialEq)]` to User
   - Implemented `Display` for User and UserError
   - Implemented `std::error::Error` for UserError
   - Added `Default` derive for UserService

5. **Module organization** (Rule 5):
   - Added `pub` visibility modifiers appropriately
   - Private fields with public accessor methods
   - Clear API boundaries

6. **Pattern matching**:
   - Used `match` for Option handling instead of `unwrap()`
   - Exhaustive error handling

### Before/After: Error Handling Example

```rust
// Before: Dangerous error handling
fn read_config(path: &str) -> Config {
    let contents = std::fs::read_to_string(path).unwrap();
    let config: Config = serde_json::from_str(&contents).unwrap();
    config
}

fn process_user(id: u64) -> String {
    let user = fetch_user(id).expect("User not found");
    user.name
}

// After: Proper error handling
use std::fs;
use std::io;

# [derive(Debug)]
enum ConfigError {
    IoError(io::Error),
    ParseError(serde_json::Error),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ConfigError::IoError(e) => write!(f, "IO error: {}", e),
            ConfigError::ParseError(e) => write!(f, "Parse error: {}", e),
        }
    }
}

impl std::error::Error for ConfigError {}

impl From<io::Error> for ConfigError {
    fn from(error: io::Error) -> Self {
        ConfigError::IoError(error)
    }
}

impl From<serde_json::Error> for ConfigError {
    fn from(error: serde_json::Error) -> Self {
        ConfigError::ParseError(error)
    }
}

fn read_config(path: &str) -> Result<Config, ConfigError> {
    let contents = fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&contents)?;
    Ok(config)
}

fn process_user(id: u64) -> Result<String, UserError> {
    let user = fetch_user(id)?;
    Ok(user.name)
}

```

### Before/After: Ownership and Borrowing Example

```rust
// Before: Unnecessary ownership transfers and cloning
fn calculate_stats(data: Vec<i32>) -> (i32, i32) {
    let sum: i32 = data.iter().sum();
    let count = data.len() as i32;
    (sum, count)
    // data is moved and dropped here
}

fn format_user(user: User) -> String {
    format!("{} - {}", user.name, user.email)
    // user is moved and dropped here
}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let (sum, count) = calculate_stats(numbers);
    // Can't use numbers anymore!
    
    let user = User::new(1, "Alice".to_string(), "alice@example.com".to_string());
    let formatted = format_user(user);
    // Can't use user anymore!
}

// After: Proper borrowing
fn calculate_stats(data: &[i32]) -> (i32, i32) {
    let sum: i32 = data.iter().sum();
    let count = data.len() as i32;
    (sum, count)
}

fn format_user(user: &User) -> String {
    format!("{} - {}", user.name(), user.email())
}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let (sum, count) = calculate_stats(&numbers);
    println!("Sum: {}, Count: {}", sum, count);
    println!("Numbers still available: {:?}", numbers);
    
    let user = User::new(1, "Alice".to_string(), "alice@example.com".to_string())?;
    let formatted = format_user(&user);
    println!("{}", formatted);
    println!("User still available: {:?}", user);
}

```

## Customization

**This is your starting point!** This steering document provides a solid foundation for writing safe, idiomatic Rust code. However, every project has unique needs.

You can customize these rules by editing this steering document to match your project's requirements:

- **Adjust error handling patterns**: Add project-specific error types or error handling strategies

- **Extend trait implementations**: Include additional traits commonly used in your domain

- **Add async/await patterns**: Include tokio or async-std patterns if building async applications

- **Include testing patterns**: Add guidelines for writing tests with proper assertions

- **Add performance guidelines**: Include optimization patterns specific to your use case

- **Extend module organization**: Adapt to your project's specific structure

- **Add framework-specific patterns**: Include patterns for web frameworks (Actix, Rocket, Axum) or other libraries

- **Include unsafe code guidelines**: If your project requires unsafe code, add safety documentation requirements

The goal is to have a steering document that works for your team and project, ensuring Kiro generates code that fits seamlessly into your Rust codebase.

## Optional: Validation with External Tools

Want to validate that generated Rust code follows these standards? Rust has excellent built-in tools for formatting and linting.

### Quick Setup (Optional)

If you have Rust installed, you already have access to these tools. If not, install Rust from [https://rustup.rs/](https://rustup.rs/)

**Check if you have Rust installed:**

```bash
rustc --version
cargo --version

```

### rustfmt (Optional)

The `rustfmt` tool automatically formats your Rust code according to the official Rust style guide. It handles indentation, spacing, line breaks, and more.

**Basic usage:**

```bash
# Format a single file
rustfmt src/main.rs

# Format entire project
cargo fmt

# Check formatting without making changes
cargo fmt -- --check

# Format with specific edition
cargo fmt --edition 2021

```

**What it does:**

- Enforces 4-space indentation

- Adds/removes trailing commas appropriately

- Formats function signatures and struct definitions

- Ensures consistent spacing and line breaks

- Follows official Rust style guide

**Configuration (optional):**

Create a `rustfmt.toml` in your project root:

```toml
edition = "2021"
max_width = 100
use_small_heuristics = "Default"

```

**Note**: This tool validates and formats the code after Kiro writes it, but isn't required for the steering document to work. Kiro will already follow these formatting standards.

### Clippy (Optional)

Clippy is Rust's official linter that catches common mistakes and suggests idiomatic improvements. It goes beyond the compiler to find potential bugs and style issues.

**Basic usage:**

```bash
# Run clippy on your project
cargo clippy

# Run with all warnings as errors
cargo clippy -- -D warnings

# Run with specific lint levels
cargo clippy -- -W clippy::pedantic

# Fix automatically fixable issues
cargo clippy --fix

```

**What it checks:**

- Common mistakes and anti-patterns

- Performance issues

- Idiomatic Rust patterns

- Unnecessary clones and allocations

- Error handling improvements

- Type complexity

- Documentation issues

**Example output:**

```text
warning: you seem to be trying to use `match` for destructuring a single pattern
  --> src/main.rs:12:5
   |
12 |     match user {
   |     ^^^^^^^^^^^^
   |
   = help: consider using `if let`
   = note: `#[warn(clippy::single_match)]` on by default

warning: this function has too many arguments (8/7)
  --> src/lib.rs:45:1
   |
45 | pub fn create_user(
   | ^^^^^^^^^^^^^^^^^^
   |
   = help: consider using a struct for some arguments

```

**Note**: This tool validates the code after Kiro writes it, but isn't required for the steering document to work. Kiro will already follow best practices to prevent most clippy warnings.

### cargo check (Optional)

The `cargo check` command quickly checks your code for errors without producing an executable. It's faster than `cargo build` and perfect for rapid feedback.

**Basic usage:**

```bash
# Check your project
cargo check

# Check with all features
cargo check --all-features

# Check tests
cargo check --tests

# Check benchmarks
cargo check --benches

```

**What it does:**

- Type checking

- Borrow checker validation

- Lifetime verification

- Trait bound checking

- Macro expansion validation

### Integration with CI/CD (Optional)

You can add these tools to your continuous integration pipeline to ensure code quality:

```yaml
# Example GitHub Actions workflow
name: Rust CI

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          components: rustfmt, clippy
      
      - name: Check formatting
        run: cargo fmt -- --check
      
      - name: Run clippy
        run: cargo clippy -- -D warnings
      
      - name: Run tests
        run: cargo test
      
      - name: Build
        run: cargo build --release

```

**Remember**: These external tools are optional validation steps. The steering document guides Kiro to write properly formatted, safe, idiomatic Rust code from the start, so these tools should find minimal or no issues.
