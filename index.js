// Originally inspired by https://github.com/vanekj/validate-json-action

// @ts-check
import core from "@actions/core";
import Ajv from "ajv";
import styles from "ansi-styles";
import { prettify } from "awesome-ajv-errors";
import parseJson from "parse-json";

const schemaStringInput = core.getInput("schema-string", { required: true });
const jsonStringInput = core.getInput("json-string", { required: true });

let schemaObject;
try {
  schemaObject = parseJson(schemaStringInput);
} catch (err) {
  core.setFailed(
    `${styles.red.open}✖︎ The given schema input does not contain valid JSON and so the object cannot be validated.
    
${err}

    ${styles.red.close}`
  );
  process.exit(1);
}

const ajv = new Ajv({ allErrors: true });
const validateFn = ajv.compile(schemaObject);

let jsonObject;
try {
  jsonObject = parseJson(jsonStringInput);
} catch (err) {
  core.setFailed(
    `${styles.red.open}✖︎ The given input does not contain valid JSON and so the object cannot be validated.
    
${err}

    ${styles.red.close}`
  );
  process.exit(1);
}

const validationResult = validateFn(jsonObject);
if (!validationResult) {
  if (validateFn.errors) {
    core.startGroup("Raw validation details");
    core.info(JSON.stringify(validateFn.errors, null, 2));
    core.endGroup();
  }

  core.setFailed(
    `${styles.red.open}✖︎ The given input did not match the validation schema${styles.red.close}`
  );

  console.log("\n" + prettify(validateFn, { data: jsonObject }));

  process.exit(1);
}

core.info(
  `${styles.green.open}✔ The given input is valid JSON and matched the validation schema`
);
