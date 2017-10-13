const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

module.exports = {
    createLineItemFromAssignment: (assignment) => {
        return {
            lineItem: {
                title: assignment.name,
                assignDate: assignment.assignDate + 'T00:00:00.000Z',
                dueDate: assignment.dueDate + 'T00:00:00.000Z',
                resultValueMin: assignment.resultValueMin,
                resultValueMax: assignment.resultValueMax,
                class: {
                    sourcedId: assignment.classSourcedId
                }
            }
        };
    },
    createResultFromScore: (score) => {
        return {
            result: {
                score: score.score,
                scoreStatus: "submitted",
                scoreDate: score.date + 'T00:00:00.000Z',
                lineItem: {
                    sourcedId: score.lineItemSourcedId
                },
                student: {
                    sourcedId: score.studentSourcedId
                }
            }
        }
    },
    getOAuth: (key, secret) => {
        return OAuth({
            consumer: {
                key: key,
                secret: secret
            },
            signature_method: 'HMAC-SHA1',
            hash_function: (base_string, key) => {
                return crypto.createHmac('sha1', key).update(base_string).digest('base64');
            }
        });
    }
}