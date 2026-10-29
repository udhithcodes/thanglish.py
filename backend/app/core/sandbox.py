import ast
import subprocess
import tempfile
import os
import sys
from typing import Dict, Any, List

DANGEROUS_MODULES = {
    "os", "sys", "subprocess", "shutil", "socket", "http", "urllib", "requests",
    "pty", "ctypes", "pathlib", "importlib", "builtins"
}

DANGEROUS_CALLS = {
    "open", "eval", "exec", "compile", "__import__", "globals", "locals", "getattr", "setattr", "delattr"
}

class SecurityVisitor(ast.NodeVisitor):
    def __init__(self):
        self.errors = []

    def visit_Import(self, node):
        for alias in node.names:
            root_mod = alias.name.split(".")[0]
            if root_mod in DANGEROUS_MODULES:
                self.errors.append(f"Forbidden import: '{alias.name}'. Disallowed for security.")
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module:
            root_mod = node.module.split(".")[0]
            if root_mod in DANGEROUS_MODULES:
                self.errors.append(f"Forbidden import from: '{node.module}'. Disallowed for security.")
        self.generic_visit(node)

    def visit_Call(self, node):
        # Disallow dangerous builtins calls like open() or eval()
        if isinstance(node.func, ast.Name) and node.func.id in DANGEROUS_CALLS:
            self.errors.append(f"Forbidden function call: '{node.func.id}()'. Disallowed for security.")
        self.generic_visit(node)

def validate_code_safety(code: str) -> List[str]:
    """Inspects AST for forbidden syntax or security violations."""
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return [f"Syntax Error on line {e.lineno}: {e.msg}"]
    
    visitor = SecurityVisitor()
    visitor.visit(tree)
    return visitor.errors

def execute_user_code(code: str, test_inputs: List[str] = None, timeout: float = 2.5) -> Dict[str, Any]:
    """
    Executes student code safely in an isolated temporary environment with timeout.
    Returns stdout, stderr, exit code, and execution time.
    """
    safety_errors = validate_code_safety(code)
    if safety_errors:
        return {
            "success": False,
            "stdout": "",
            "stderr": "\n".join(safety_errors),
            "error_type": "SecurityViolation",
            "is_safe": False
        }

    input_text = "\n".join(test_inputs or [])

    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(code)
        temp_file = f.name

    try:
        # Isolated execution using standard python with restricted flags
        env = {
            "PYTHONHASHSEED": "0",
            "LC_ALL": "C.UTF-8",
            "LANG": "C.UTF-8"
        }

        proc = subprocess.run(
            [sys.executable, "-B", "-u", temp_file],
            input=input_text,
            capture_output=True,
            text=True,
            timeout=timeout,
            env=env
        )

        return {
            "success": proc.returncode == 0,
            "stdout": proc.stdout,
            "stderr": proc.stderr,
            "error_type": None if proc.returncode == 0 else "RuntimeError",
            "is_safe": True
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Time Limit Exceeded (Timeout > {timeout}s). Check for infinite loops.",
            "error_type": "TimeoutExpired",
            "is_safe": True
        }
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": str(e),
            "error_type": "ExecutionError",
            "is_safe": False
        }
    finally:
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except Exception:
                pass
