# To emulate nextjs_call with get_errors on dev server port, we will simulate static analysis of typical error logs.
# Since we can't run dev server here, we simulate error retrieval with mocked data.

def simulate_nextjs_dev_server_errors():
    # Example errors that might happen during next.js build/dev runtime:
    errors = [
        {
            "type": "Build",
            "message": "ModuleNotFoundError: Can't resolve 'some-missing-package'",
            "file": "pages/index.tsx",
            "line": 12,
            "severity": "error"
        },
        {
            "type": "Type",
            "message": "Type 'string' is not assignable to type 'number'.",
            "file": "components/Booking.tsx",
            "line": 45,
            "severity": "error"
        },
        {
            "type": "Runtime",
            "message": "Cannot read property 'map' of undefined",
            "file": "pages/professionals.tsx",
            "line": 32,
            "severity": "error"
        },
        {
            "type": "Warning",
            "message": "React Hook useEffect has missing dependencies: ...",
            "file": "components/Chat.tsx",
            "line": 80,
            "severity": "warning"
        }
    ]
    return errors

simulate_nextjs_dev_server_errors()
