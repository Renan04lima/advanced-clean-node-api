import { RequiredFieldError } from "@/application/errors/http";
import { Validator } from "./validator";

export class RequiredStringValidator implements Validator {
    constructor(
        private readonly value: string,
        private readonly fieldName: string
    ) { }

    validate(): Error | undefined {
        if (!this.value)
            return new RequiredFieldError(this.fieldName);
    }
}
