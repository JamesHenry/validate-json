# validate-json

A Github Action which validates the given stringified input data against the given stringified JSON schema.

## Example Usage

**.github/workflows/ci.yml**

<!-- start example-usage -->

```yaml
# ... more CI config ...

jobs:
  primary:
    runs-on: ubuntu-latest
    name: Primary
    steps:
      # ... more step config ...

      - name: Validate against JSON schema
        uses: jameshenry/validate-json@v1
        with:
          schema-input: "{ ...json schema here... }"
          json-input: "{ ...json here... }"

      # ... more CI config ...
```

<!-- end example-usage -->

## Configuration Options

<!-- start configuration-options -->

```yaml
- uses: jameshenry/validate-json@v1
  with:
    # Each input is a string, and is required. There are no additional inputs.
    schema-string: ""
    json-string: ""
```

<!-- end configuration-options -->
