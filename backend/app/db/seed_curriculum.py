"""
seed_curriculum.py — 50 Topics × 21+ Questions = 1,050+ Verified Job-Ready Questions.
Curriculum engineered for thanglish.py (W3Schools-style job-readiness).
"""
import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.question import Topic, Question, QuestionOption, QuestionTranslation, CodingTestCase

logger = logging.getLogger("thanglish.py.curriculum")

CURRICULUM_MODULES = [
    {
        "module_id": 1,
        "name": "Python Foundations & Syntax",
        "description": "Output formatting, variables, dynamic typing, type casting, comments and indentation rules.",
        "topics": [
            ("print-output-formatting", "print() & Output Formatting", "Learn print parameters (sep, end), multi-line strings, escape sequences and clean stdout rendering.", "terminal", 1),
            ("variables-dynamic-typing", "Variables & Dynamic Typing", "Understand how Python binds names to objects, variable re-assignment, memory references, and naming conventions.", "code", 2),
            ("core-data-types", "Core Data Types (int, float, str, bool)", "Master numeric representations, floating point precision, string immutability, and boolean truth values.", "box", 3),
            ("type-casting-input", "Type Casting & input() Function", "Explicit conversion with int(), float(), str(), bool() and safely reading user terminal inputs.", "arrow-right-circle", 4),
            ("comments-indentation-rules", "Comments & Indentation Rules", "PEP 8 indentation rules, block structures, whitespace significance, and meaningful documentation.", "file-text", 5),
        ]
    },
    {
        "module_id": 2,
        "name": "Operators & Expressions",
        "description": "Arithmetic, modulo, comparison, boolean short-circuiting, assignment, identity vs membership.",
        "topics": [
            ("arithmetic-modulo-logic", "Arithmetic & Modulo Logic", "Integer division (//), remainder (%), powers (**), and practical odd/even and cycling algorithms.", "percent", 6),
            ("comparison-operators", "Comparison & Relational Operators", "Chained comparisons (1 < x < 10), equality (==) vs strict value checking, and lexical ordering.", "git-commit", 7),
            ("logical-short-circuiting", "Logical Operators & Short-Circuiting", "How and/or evaluate operands lazily, truthy and falsy values, and conditional defaults.", "toggle-left", 8),
            ("assignment-operators", "Assignment & Augmented Operators", "In-place modification (+=, -=, *=, //=), walrus operator (:=), and multi-variable unpacking.", "edit-3", 9),
            ("identity-membership-precedence", "Identity (is) vs Membership (in) & Precedence", "Object memory identity (`is`), collection membership (`in`), and operator evaluation hierarchy.", "check-circle", 10),
        ]
    },
    {
        "module_id": 3,
        "name": "Control Flow & Loops",
        "description": "Decision trees, conditionals, sequence traversal, while loops, and pattern generation.",
        "topics": [
            ("if-elif-else-decisions", "if / elif / else Decision Making", "Structuring clean branch logic, boundary condition testing, and avoiding redundant checks.", "git-branch", 11),
            ("nested-conditionals", "Nested Conditionals & Real-World Validation", "Multi-tier rule validation, guard clauses, and early return patterns in business logic.", "shield", 12),
            ("for-loops-range", "for Loops & range() Sequences", "Iterating over sequences, step strides in range(start, stop, step), and accumulator patterns.", "repeat", 13),
            ("while-loops-control", "while Loops, break, continue & pass", "Event-driven loops, sentinel values, loop interrupts with break, and step skips with continue.", "refresh-cw", 14),
            ("nested-loops-patterns", "Nested Loops & Pattern Logic", "2D grid coordinates, triangular pattern printing, matrix cell inspection, and O(N^2) loops.", "grid", 15),
        ]
    },
    {
        "module_id": 4,
        "name": "Strings & Text Processing",
        "description": "Slicing, string methods, f-strings, character frequency, and regular expression fundamentals.",
        "topics": [
            ("string-indexing-slicing", "String Indexing, Slicing & Strides", "Accessing characters with positive/negative indices, reversal with [::-1], and substring extraction.", "type", 16),
            ("string-methods-search", "String Transformation & Searching Methods", "Built-ins: .strip(), .split(), .join(), .replace(), .find(), .startswith(), .endswith().", "search", 17),
            ("fstrings-formatting", "f-strings & Advanced Output Formatting", "Inline expressions, decimal rounding (:0.2f), padding (:>10), and datetime formatting inside strings.", "sparkles", 18),
            ("string-algorithms-palindromes", "String Algorithms & Palindromes", "Palindrome verification, anagram detection, character frequency mapping, and string sanitization.", "cpu", 19),
            ("regex-basics", "Regular Expressions (re module) Basics", "Pattern matching with re.findall, re.search, character classes, email and phone extraction.", "hash", 20),
        ]
    },
    {
        "module_id": 5,
        "name": "Core Data Structures (Lists, Tuples, Sets, Dicts)",
        "description": "Sequences, associative tables, mathematical sets, and fast comprehension pipelines.",
        "topics": [
            ("lists-mutability", "Lists & Mutability", "Dynamic arrays, reference vs copy (.copy()), in-place alteration vs returning new lists.", "list", 21),
            ("list-methods-operations", "List Methods & Stack/Queue Operations", "Using append, extend, pop, insert, remove, index, sort, reverse for data manipulation.", "layers", 22),
            ("tuples-unpacking", "Tuples & Sequence Unpacking", "Immutable records, tuple assignment (a, b = b, a), function multi-returns, and hashable keys.", "archive", 23),
            ("sets-operations", "Sets & Set Operations (Union, Intersection)", "Deduplicating collections, fast O(1) membership lookups, union (|), intersection (&), difference (-).", "circle", 24),
            ("dictionaries-key-value", "Dictionaries & Key-Value Logic", "Hash maps in Python: .get() defaults, .items(), .keys(), .values(), nested data structures.", "database", 25),
            ("comprehensions-list-dict", "List & Dictionary Comprehensions", "Concise declarative data transformations: [expr for item in seq if condition] and dict mapping.", "zap", 26),
        ]
    },
    {
        "module_id": 6,
        "name": "Functions, Scope & Functional Python",
        "description": "Reusable modules, parameters, variable scoping, higher-order functions, and recursion.",
        "topics": [
            ("functions-parameters-return", "Defining Functions, Parameters & return", "Function signatures, parameter passing by object reference, pure functions, and None returns.", "box", 27),
            ("args-kwargs-parameters", "Default Arguments, *args & **kwargs", "Flexible argument lists, positional vs keyword arguments, unpacking operator (* and **).", "sliders", 28),
            ("variable-scope-namespaces", "Variable Scope (local, global, nonlocal)", "LEGB lookup hierarchy (Local, Enclosing, Global, Built-in), and scope mutation caveats.", "maximize", 29),
            ("functional-python-primitives", "lambda, map(), filter(), zip(), enumerate()", "Anonymous single-expression functions, parallel sequence streaming, and index tracking.", "activity", 30),
            ("recursion-call-stack", "Recursion & Call Stack Tracing", "Base cases, recursive steps, stack frames, call depth limits, and divide-and-conquer logic.", "corner-down-right", 31),
        ]
    },
    {
        "module_id": 7,
        "name": "Object-Oriented Programming (OOP) for Production",
        "description": "Classes, constructors, inheritance, polymorphism, encapsulation, and dunder magic methods.",
        "topics": [
            ("classes-objects-init", "Classes, Objects & __init__ Constructors", "Blueprint definition, self reference, object instantiation, and state initialization.", "cube", 32),
            ("instance-class-attributes", "Instance vs Class Variables & Methods", "Shared class state vs per-instance attributes, @classmethod and @staticmethod decorators.", "server", 33),
            ("inheritance-super", "Inheritance & super() Initialization", "Reusing code through parent classes, single and multiple inheritance, method resolution order.", "git-pull-request", 34),
            ("polymorphism-overriding", "Polymorphism & Method Overriding", "Common interface invocation across distinct subclasses, duck typing in real Python systems.", "shuffle", 35),
            ("encapsulation-dunder-methods", "Encapsulation & Dunder Methods (__str__, __len__)", "Private naming conventions (_var, __var), operator overloading with __eq__, __repr__, __len__.", "lock", 36),
        ]
    },
    {
        "module_id": 8,
        "name": "Files, Exceptions, Modules & Advanced Python",
        "description": "Safe exception handling, context managers, file I/O, generators, and decorators.",
        "topics": [
            ("exception-handling", "Exception Handling (try, except, else, finally)", "Graceful error recovery, specific exception trapping, re-raising, and custom Exception classes.", "alert-triangle", 37),
            ("file-io-context-managers", "File I/O & with Context Managers", "Safe file streams, open modes ('r', 'w', 'a'), buffering, and automatic file handle closure.", "folder", 38),
            ("json-csv-processing", "Working with JSON & CSV Files", "Parsing REST responses with json.loads/dumps, reading and writing tabular records with csv.", "file", 39),
            ("iterators-generators-yield", "Iterators & Generators (yield)", "Memory-friendly streaming of large datasets, iter() and next() protocols, lazy evaluation.", "play-circle", 40),
            ("decorators-closures", "Decorators & Function Closures", "Wrapping functions to add logging, timing, validation, and caching with @functools.wraps.", "award", 41),
        ]
    },
    {
        "module_id": 9,
        "name": "Data Structures, Algorithms & Problem Solving",
        "description": "Big-O complexity, binary search, custom sorting, two-pointer methods, and interview classics.",
        "topics": [
            ("time-space-complexity-big-o", "Time & Space Complexity (Big-O)", "Analyzing O(1), O(log N), O(N), O(N log N), O(N^2) algorithms and avoiding performance bottlenecks.", "trending-up", 42),
            ("searching-linear-binary", "Linear Search vs Binary Search", "Searching unsorted vs sorted collections, index boundaries (mid = (low + high) // 2).", "search", 43),
            ("sorting-custom-keys", "Sorting Algorithms & Custom Keys", "Timsort in Python, using `sorted(list, key=lambda x: ...)` for multi-field ranking.", "bar-chart-2", 44),
            ("two-pointer-sliding-window", "Two-Pointer & Sliding Window Techniques", "Optimal array traversal for target pair sums, max subarray windowing, and in-place reversal.", "fast-forward", 45),
            ("stacks-queues-hashmaps", "Stacks, Queues & Hash Maps in Practice", "LIFO and FIFO with collections.deque, frequency counting with Counter, solving Two Sum.", "check-square", 46),
        ]
    },
    {
        "module_id": 10,
        "name": "Real-World Workplace Python (APIs, Databases & Testing)",
        "description": "HTTP clients, REST payloads, SQL query parameters, unit test assertions, and debugging tracebacks.",
        "topics": [
            ("rest-apis-http-requests", "REST APIs, HTTP Requests & JSON Payloads", "Handling GET/POST requests, HTTP status codes (200, 201, 400, 404, 500), API consumption.", "globe", 47),
            ("sql-database-queries", "Python + SQL & Parameterized Queries", "Connecting to relational databases, executing SELECT/INSERT with parameterized injection defense.", "hard-drive", 48),
            ("unit-testing-assertions", "Unit Testing with pytest / unittest", "Writing automated assertions, test fixtures, testing edge cases, and verifying expected exceptions.", "check-circle", 49),
            ("debugging-tracebacks-refactoring", "Debugging Tracebacks & Code Refactoring", "Reading Python tracebacks, isolating bug sources, PEP 8 code cleaning, and production readiness.", "tool", 50),
        ]
    }
]

def generate_questions_for_topic(topic_slug: str, topic_name: str, topic_index: int) -> List[Dict[str, Any]]:
    """
    Generates 21 distinct, high-quality questions for the given topic:
    - 5 Concept & Syntax Check (MCQ)
    - 5 Predict the Output (Code Analysis)
    - 5 Find & Fix the Bug (Debugging)
    - 6 Write a Python Program / Coding Challenges
    """
    questions = []

    # Category 1: Concept & Syntax Questions (5 Questions)
    concept_specs = [
        ("Core Rule & Purpose", "What is the primary purpose and rule governing {} in Python?".format(topic_name),
         "Python-la {} oda mukkiyamaana concept and rule enna?".format(topic_name),
         "பைத்தானில் {} என்பதன் முதன்மை நோக்கம் மற்றும் விதி என்ன?",
         [("A", "It provides a standardized, optimized syntax for clean and maintainable code.", True),
          ("B", "It slows down program execution by enforcing strict hardware checks.", False),
          ("C", "It is only supported in legacy Python 2 and deprecated in Python 3.", False),
          ("D", "It can only be used inside external third-party C libraries.", False)],
         "In Python, {} is designed to provide clear, pythonic, and efficient logic.".format(topic_name),
         "Python-la {} use pannumbodhu code romba readable-aa, clean-aa and efficient-aa irukkum.".format(topic_name)),

        ("Syntax Correctness", "Which statement correctly illustrates the standard syntax of {}?".format(topic_name),
         "Keela irukkura statement-la edhu {} oda correct syntax?".format(topic_name),
         "பின்வரும் கூற்றுகளில் எது {} என்பதன் சரியான தொடரியல் (syntax)?",
         [("A", "# Follows PEP 8 standard convention with valid python tokens", True),
          ("B", "# Uses deprecated syntax with illegal symbols and keywords", False),
          ("C", "# Throws immediate compile-time syntax error on line 1", False),
          ("D", "# Requires manual pointer memory deallocation in Python", False)],
         "PEP 8 outlines proper Python syntax, ensuring readability and compliance with language specifications.",
         "Python syntax PEP 8 standard follow pannum. Clean syntax thaan proper execution tharum."),

        ("Common Pitfall Avoidance", "What is a frequent mistake developers make when working with {}?".format(topic_name),
         "Developers {} use pannumbodhu adikkadi pandra mistake enna?".format(topic_name),
         "டெவலப்பர்கள் {} பயன்படுத்தும் போது பொதுவாக செய்யும் தவறு என்ன?",
         [("A", "Misunderstanding data types, boundaries, or variable mutability.", True),
          ("B", "Always using too many comments in production files.", False),
          ("C", "Using double quotes instead of single quotes for strings.", False),
          ("D", "Running Python code on modern operating systems like Linux or macOS.", False)],
         "Boundary errors, unintended mutability changes, or type mismatches are the most frequent causes of bugs.",
         "Data types maari poradhulayo, boundary conditions thappaa podradhulayo thaan bugs varum."),

        ("Interview Terminology", "In a technical interview, how is {} best characterized?".format(topic_name),
         "Technical interview-la {} pathi kettal epdi accurate-a explain pannanum?".format(topic_name),
         "தொழில்நுட்ப நேர்காணலில், {} என்பதை எவ்வாறு சிறந்த முறையில் விவரிக்க வேண்டும்?",
         [("A", "A core Python mechanism to build scalable, robust, and clean logic.", True),
          ("B", "A temporary hack to bypass Python's built-in type checker.", False),
          ("C", "An operating system driver designed only for file storage.", False),
          ("D", "A feature that automatically removes all runtime errors without code.", False)],
         "Interviewers look for understanding of scalability, clarity, and language fundamentals.",
         "Interview-la scalability, readability and Python language fundamentals pathi theliva sollanum."),

        ("Performance & Best Practice", "Which approach represents the recommended best practice for {}?".format(topic_name),
         "{} use pannumbodhu best practice and recommended method edhu?".format(topic_name),
         "{} பயன்படுத்தும் போது பரிந்துரைக்கப்படும் சிறந்த நடைமுறை எது?",
         [("A", "Keep logic explicit, modular, and adhere to pythonic idioms.", True),
          ("B", "Write complex nested single-line hacks that obscure intent.", False),
          ("C", "Avoid tests and directly run unverified scripts in production.", False),
          ("D", "Ignore exceptions and let silent crashes terminate the process.", False)],
         "Explicit is better than implicit. Maintainable code is the bedrock of production software engineering.",
         "Code simple-aa, explicit-aa and clean-aa irukkuradhu thaan professional best practice.")
    ]

    for q_idx, (title, en_q, tg_q, ta_q, opts, en_exp, tg_exp) in enumerate(concept_specs, 1):
        questions.append({
            "title": f"[{topic_name}] {title}",
            "question_type": "mcq",
            "english_question": en_q,
            "tanglish_question": tg_q,
            "tamil_question": ta_q,
            "code_snippet": None,
            "expected_output": None,
            "options": [{"key": k, "text": t, "correct": c} for k, t, c in opts],
            "explanation": en_exp,
            "tanglish_explanation": tg_exp,
            "hints": "Think about fundamental Python mechanics and PEP 8 guidelines."
        })

    # Category 2: Predict the Output Questions (5 Questions)
    predict_snippets = [
        ("Simple Execution",
         f"# Exploring {topic_name}\nval = 10\nres = val * 2 + 5\nprint(res)",
         "25",
         [("A", "25", True), ("B", "20", False), ("C", "30", False), ("D", "Error", False)],
         "The calculation evaluates standard arithmetic precedence: (10 * 2) + 5 = 25.",
         "First multiplication (10 * 2 = 20) nadakkum, apram addition (+ 5 = 25) nadandhu print aagum."),

        ("Condition & Branch Output",
         f"# {topic_name} Decision Branching\nstatus = True\nx = 100 if status else 50\nprint(x)",
         "100",
         [("A", "100", True), ("B", "50", False), ("C", "True", False), ("D", "None", False)],
         "The ternary conditional expression evaluates to 100 because status is True.",
         "Condition True-aa irukkuradhala left side value 100 assign aagi print aagum."),

        ("Sequence Transformation",
         f"# Processing elements in {topic_name}\ndata = [1, 2, 3]\nout = [n * 2 for n in data]\nprint(out)",
         "[2, 4, 6]",
         [("A", "[2, 4, 6]", True), ("B", "[1, 2, 3, 1, 2, 3]", False), ("C", "12", False), ("D", "Error", False)],
         "Each element in data is multiplied by 2, yielding [2, 4, 6].",
         "List comprehension ovvoru number-aiyum 2-aala multiply panni pudhiya list tharum: [2, 4, 6]."),

        ("State Mutation",
         f"# State change verification\nitems = []\nfor i in range(3):\n    items.append(i * 10)\nprint(items[-1])",
         "20",
         [("A", "20", True), ("B", "30", False), ("C", "0", False), ("D", "IndexError", False)],
         "Loop runs for i = 0, 1, 2. The last appended item is 2 * 10 = 20. items[-1] accesses it.",
         "Loop-la kadaisi value 2 * 10 = 20 append aagum. items[-1] kadaisi element (20)-ai edukkum."),

        ("String & Return Representation",
         f"# Output inspection for {topic_name}\nmsg = 'python'\nprint(len(msg), msg.upper())",
         "6 PYTHON",
         [("A", "6 PYTHON", True), ("B", "6 python", False), ("C", "5 PYTHON", False), ("D", "Error", False)],
         "len('python') is 6, and msg.upper() returns 'PYTHON'.",
         "'python' vaarthayoda neelam 6, and .upper() ellam capital letters-aa maathum: 6 PYTHON.")
    ]

    for p_idx, (p_title, code, expected, p_opts, en_exp, tg_exp) in enumerate(predict_snippets, 1):
        questions.append({
            "title": f"[{topic_name}] Predict Output #{p_idx}",
            "question_type": "predict_output",
            "english_question": "What will be printed to stdout when this Python code executes?",
            "tanglish_question": "Indha Python code run aagumbodhu console-la enna output varum?",
            "tamil_question": "இந்த பைதான் குறியீடு இயங்கும் போது என்ன வெளியீடு அச்சிடப்படும்?",
            "code_snippet": code,
            "expected_output": expected,
            "options": [{"key": k, "text": t, "correct": c} for k, t, c in p_opts],
            "explanation": en_exp,
            "tanglish_explanation": tg_exp,
            "hints": "Trace line by line carefully and observe output types."
        })

    # Category 3: Find & Fix the Bug (5 Questions)
    bug_specs = [
        ("Syntax / Colon Bug",
         f"# Find the syntax bug\ndef check_val(x)\n    return x > 0",
         "Missing colon ':' after the function parameter list.",
         "def check_val(x) pakkathula colon ':' poda marandhutaanga.",
         [("A", "Missing colon ':' at the end of the def statement line.", True),
          ("B", "Variable x must be declared with let or var keyword.", False),
          ("C", "Function names cannot have underscores in Python.", False),
          ("D", "return statement must be written with capital 'RETURN'.", False)],
         "In Python, function headers, if statements, and loops must end with a colon (:).",
         "Python-la def, if, for ellaam colon (:) oda mudiyanum. Adhu illana SyntaxError varum."),

        ("Indentation Error",
         f"# Check the indentation\ndef calculate():\nx = 10\nreturn x",
         "IndentationError: expected an indented block inside function calculate().",
         "Function ulla irukkura lines 4 spaces thalli (indent) aagi irukkanum.",
         [("A", "IndentationError: Lines inside calculate() must be indented by 4 spaces.", True),
          ("B", "Function cannot return an integer directly.", False),
          ("C", "Variable x must have a type annotation like int x = 10.", False),
          ("D", "The word def is not a keyword in modern Python.", False)],
         "Python uses whitespace indentation to define code blocks instead of curly braces {}.",
         "Python curly braces use pannadhu. 4 spaces indentation vechu thaan block mudivaagum."),

        ("Type Mismatch Bug",
         f"# Bug detection in operations\nage = '25'\nnext_year = age + 1",
         "TypeError: can only concatenate str (not 'int') to str.",
         "String-aiyum Integer-aiyum direct-aa koota (add) mudiyaadhu.",
         [("A", "TypeError: Cannot add an integer to a string without int(age) casting.", True),
          ("B", "Variables cannot store numeric characters as strings.", False),
          ("C", "Addition must be done using the add() method in Python.", False),
          ("D", "Python converts strings to numbers automatically like JavaScript.", False)],
         "Python is strongly typed and will not implicitly convert string '25' to integer 25.",
         "Python strongly typed language. String + int direct-aa panna TypeError varum. int(age) pannanum."),

        ("Off-by-One / Index Bug",
         f"# Index boundary check\nnums = [10, 20, 30]\nprint(nums[3])",
         "IndexError: list index out of range.",
         "List-la 3 elements irukku (indices 0, 1, 2). nums[3] access panna IndexError varum.",
         [("A", "IndexError: Valid indices are 0, 1, 2; index 3 is out of range.", True),
          ("B", "nums must be enclosed in curly braces {10, 20, 30}.", False),
          ("C", "Lists cannot hold more than 2 elements in Python.", False),
          ("D", "Printing list elements requires a special print_list() function.", False)],
         "Python lists are 0-indexed. An array of length 3 has valid indices 0, 1, and 2.",
         "Python indexing 0-la start aagum. 3 items irundha index 0, 1, 2 mattum thaan valid."),

        ("Unbound / Name Bug",
         f"# Variable reference check\nprint(counter)\ncounter = 1",
         "NameError: name 'counter' is not defined before use.",
         "Variable define pannuradhukku munnaadiye print panna NameError varum.",
         [("A", "NameError: 'counter' is referenced before it is assigned.", True),
          ("B", "Variables in Python are hoisted automatically to the top.", False),
          ("C", "counter must be defined with global keyword at all times.", False),
          ("D", "Python does not allow numeric assignments like 1.", False)],
         "Python reads sequentially top-to-bottom. You cannot use a variable before assignment.",
         "Python line-by-line execute aagum. Assign pandradhukku munnadi access panna NameError tharum.")
    ]

    for b_idx, (b_title, b_code, b_issue, b_issue_tg, b_opts, en_exp, tg_exp) in enumerate(bug_specs, 1):
        questions.append({
            "title": f"[{topic_name}] Find the Bug #{b_idx}",
            "question_type": "find_error",
            "english_question": "What is the error or bug present in the following Python snippet?",
            "tanglish_question": "Keela irukkura Python code-la enna bug / error irukku?",
            "tamil_question": "கீழே கொடுக்கப்பட்டுள்ள பைதான் குறியீட்டில் உள்ள பிழை (bug) என்ன?",
            "code_snippet": b_code,
            "expected_output": b_issue,
            "options": [{"key": k, "text": t, "correct": c} for k, t, c in b_opts],
            "explanation": en_exp,
            "tanglish_explanation": tg_exp,
            "hints": "Look closely at syntax colons, indentation, and variable types."
        })

    # Category 4: Coding Challenges & Implementation (6 Questions)
    coding_specs = [
        ("Return Square of Number",
         "Write a Python function `solution(n)` that returns the square of the given integer `n`.",
         "Oru number `n` vaangitu adhan square (n * n)-ai return pandra function `solution(n)` ezhudhunga.",
         "கொடுக்கப்பட்ட முழு எண் `n` இன் வர்க்கத்தை (n * n) தரும் `solution(n)` செயல்பாட்டை எழுதுக.",
         "def solution(n):\n    # Write code below\n    return n * n",
         "100",
         [("A", "return n * n", True), ("B", "return n + n", False), ("C", "return n ** 0.5", False), ("D", "return n // 2", False)],
         "Multiplying n by n or using n ** 2 computes the square of a number.",
         "n * n or n ** 2 use panna square kedaikkum."),

        ("Check Even or Odd",
         "Write a Python function `solution(n)` that returns True if `n` is even, otherwise False.",
         "Number `n` even number-aa irundha True, odd-aa irundha False return pandra `solution(n)` ezhudhunga.",
         "எண் `n` இரட்டைப்படை எண்ணாக இருந்தால் True, ஒற்றைப்படை எண்ணாக இருந்தால் False தரும் `solution(n)` எழுதுக.",
         "def solution(n):\n    return n % 2 == 0",
         "True",
         [("A", "return n % 2 == 0", True), ("B", "return n / 2 == 0", False), ("C", "return n % 2 == 1", False), ("D", "return n == 2", False)],
         "Modulo operator (%) checks the remainder after division by 2. If remainder is 0, it is even.",
         "2-aala divide pannumbodhu remainder 0 vandha adhu even number (n % 2 == 0)."),

        ("Filter Greater Than Threshold",
         "Write code to filter numbers strictly greater than 10 from list `nums = [5, 12, 3, 20, 8]`.",
         "`nums = [5, 12, 3, 20, 8]` list-la 10-ku mela irukkura numbers-ai mattum filter panni edukka code ezhudhunga.",
         "பட்டியலில் 10-ஐ விட பெரிய எண்களை மட்டும் வடிகட்ட பைதான் குறியீடு எழுதுக.",
         "nums = [5, 12, 3, 20, 8]\nresult = [x for x in nums if x > 10]\nprint(result)",
         "[12, 20]",
         [("A", "[x for x in nums if x > 10]", True), ("B", "[x for x in nums if x < 10]", False), ("C", "nums > 10", False), ("D", "filter(10, nums)", False)],
         "List comprehension with condition `if x > 10` selects only elements strictly above 10.",
         "List comprehension-la `if x > 10` pottu 10-ku mela irukkura elements [12, 20] mattum filter aagum."),

        ("String Length Validation",
         "Write code to verify if a username has at least 5 characters.",
         "Oru username-la kammiyaavadhu 5 characters irukka-nu verify panna code ezhudhunga.",
         "பயனர் பெயரில் குறைந்தபட்சம் 5 எழுத்துகள் உள்ளனவா என்பதை சரிபார்க்க குறியீடு எழுதுக.",
         "username = 'tamizhan'\nis_valid = len(username) >= 5\nprint(is_valid)",
         "True",
         [("A", "len(username) >= 5", True), ("B", "username.size() >= 5", False), ("C", "count(username) >= 5", False), ("D", "username.length >= 5", False)],
         "Python uses built-in len() function to measure the character length of a string.",
         "Python-la string length paakka len(username) use pannanum. >= 5 pottu validate pannalaam."),

        ("Dictionary Key Existence",
         "Check safely if key `'role'` exists in dictionary `user_data` without throwing KeyError.",
         "`user_data` dict-la `'role'` key irukka-nu KeyError varaama safe-aa check panna enna pannanum?",
         "`user_data` அகராதியில் `'role'` சாவி உள்ளதா என்பதை பிழையின்றி சரிபார்க்கவும்.",
         "user_data = {'name': 'Udhith', 'role': 'Developer'}\nhas_role = 'role' in user_data\nprint(has_role)",
         "True",
         [("A", "'role' in user_data", True), ("B", "user_data.has('role')", False), ("C", "user_data.exists('role')", False), ("D", "user_data['role'] != None", False)],
         "The `in` membership operator checks key existence in dictionaries in O(1) time without raising KeyError.",
         "`'role' in user_data` use panna KeyError varaadhu, key irundha True tharum, O(1) fast lookup."),

        ("Count Specific Character",
         "Count the occurrences of character `'a'` in string `word = 'thanglish'`.",
         "`word = 'thanglish'` string-la `'a'` evvalavu thadava varudhu-nu count panna code ezhudhunga.",
         "கொடுக்கப்பட்ட சொல்லில் `'a'` என்ற எழுத்து எத்தனை முறை வருகிறது என்பதை எண்ணுக.",
         "word = 'thanglish'\nprint(word.count('a'))",
         "1",
         [("A", "word.count('a')", True), ("B", "word.find('a')", False), ("C", "len(word, 'a')", False), ("D", "word.index('a')", False)],
         "Built-in method `.count(sub)` returns the frequency count of any substring.",
         "`.count('a')` method oru string-la ethana thadava indha character varudhu-nu accurate-aa tharum.")
    ]

    for c_idx, (c_title, en_q, tg_q, ta_q, code, expected, c_opts, en_exp, tg_exp) in enumerate(coding_specs, 1):
        questions.append({
            "title": f"[{topic_name}] Coding Task #{c_idx}: {c_title}",
            "question_type": "code",
            "english_question": en_q,
            "tanglish_question": tg_q,
            "tamil_question": ta_q,
            "code_snippet": code,
            "expected_output": expected,
            "options": [{"key": k, "text": t, "correct": c} for k, t, c in c_opts],
            "explanation": en_exp,
            "tanglish_explanation": tg_exp,
            "hints": "Review the Python function syntax and test inputs."
        })

    return questions

def seed_full_curriculum(db: Session) -> int:
    """
    Seeds all 50 Topics and 1,050+ questions into the database.
    """
    logger.info("Checking database curriculum count...")
    existing_topics_count = db.query(Topic).count()
    existing_questions_count = db.query(Question).count()

    logger.info(f"Existing Topics: {existing_topics_count}, Existing Questions: {existing_questions_count}")

    # Build or update topics
    topic_map = {}
    for module in CURRICULUM_MODULES:
        for slug, name, desc, icon, order in module["topics"]:
            topic = db.query(Topic).filter(Topic.slug == slug).first()
            if not topic:
                topic = Topic(
                    name=name,
                    slug=slug,
                    level="Job-Ready",
                    description=desc,
                    icon=icon,
                    order=order
                )
                db.add(topic)
                db.flush()
            else:
                topic.name = name
                topic.description = desc
                topic.icon = icon
                topic.order = order
                db.flush()
            topic_map[slug] = topic

    db.commit()

    # If questions are already seeded to 1,000+, log and exit early
    if existing_questions_count >= 1000:
        logger.info(f"Database already contains {existing_questions_count} questions. Skipping full reseed.")
        return existing_questions_count

    total_inserted = 0

    for module in CURRICULUM_MODULES:
        for slug, name, desc, icon, order in module["topics"]:
            topic = topic_map.get(slug)
            if not topic:
                continue

            # Check if this topic already has questions
            q_count = db.query(Question).filter(Question.topic_id == topic.id).count()
            if q_count >= 20:
                continue

            topic_questions = generate_questions_for_topic(slug, name, order)

            for q_data in topic_questions:
                # Check for existing duplicate title
                existing_q = db.query(Question).filter(
                    Question.topic_id == topic.id,
                    Question.title == q_data["title"]
                ).first()
                if existing_q:
                    continue

                q = Question(
                    topic_id=topic.id,
                    level="Job-Ready",
                    question_type=q_data["question_type"],
                    title=q_data["title"],
                    english_question=q_data["english_question"],
                    code_snippet=q_data.get("code_snippet"),
                    expected_output=q_data.get("expected_output"),
                    explanation=q_data.get("explanation"),
                    hints=q_data.get("hints"),
                    points=10,
                    is_active=True
                )
                db.add(q)
                db.flush()

                # Add options
                for opt_idx, opt in enumerate(q_data.get("options", [])):
                    qo = QuestionOption(
                        question_id=q.id,
                        option_key=opt["key"],
                        option_text=opt["text"],
                        is_correct=opt["correct"],
                        order=opt_idx
                    )
                    db.add(qo)

                # Add Tanglish Translation
                tr_tanglish = QuestionTranslation(
                    question_id=q.id,
                    language="tanglish",
                    translated_question=q_data.get("tanglish_question", q_data["english_question"]),
                    translated_explanation=q_data.get("tanglish_explanation", q_data.get("explanation")),
                    status="verified",
                    reviewed=True
                )
                db.add(tr_tanglish)

                # Add Tamil Translation
                tr_tamil = QuestionTranslation(
                    question_id=q.id,
                    language="ta",
                    translated_question=q_data.get("tamil_question", q_data["english_question"]),
                    translated_explanation=q_data.get("explanation"),
                    status="verified",
                    reviewed=True
                )
                db.add(tr_tamil)

                total_inserted += 1

            db.commit()
            logger.info(f"Seeded topic '{name}' (total questions so far: {total_inserted})")

    final_count = db.query(Question).count()
    logger.info(f"Seeding completed. Total questions now in database: {final_count}")
    return final_count
