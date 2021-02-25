import { ImportantLog, Sleep } from "./";

function RetryOperation(operation: () => any, delay: number, retries: number) {
    return new Promise((resolve, reject) => {
        return operation()
        .then(resolve)
        .catch((reason) => {
            if (retries > 0) {
            ImportantLog(
                `Failed to run task. Trying again after ${
                delay / 1000
                } seconds. Trying a max of ${
                retries - 1
                } more times after this next run.`
            );

            return Sleep(delay)
                .then(RetryOperation.bind(null, operation, delay, retries - 1))
                .then(resolve)
                .catch(reject);
            }
            return reject(reason);
        });
    });
}

export default RetryOperation;