class Reader:
    @classmethod
    def read_file(cls, filename: str) -> str:
        with open(filename, "r") as f:
            return f.read()
