const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const moment = require('moment');

module.exports = {
    createLineItemFromAssignment: (assignment) => {
        return {
            lineItem: {
                title: assignment.name,
                assignDate: moment(assignment.assignDate).toISOString(),
                dueDate: moment(assignment.dueDate).toISOString(),
                resultValueMin: assignment.resultValueMin,
                resultValueMax: assignment.resultValueMax,
                class: {
                    sourcedId: assignment.classSourcedId
                },
                gradingPeriod: {
                    sourcedId: assignment.gradingPeriodSourcedId
                }
            }
        };
    },
    createResultFromScore: (score) => {
        return {
            result: {
                score: score.score,
                scoreStatus: "submitted",
                scoreDate: moment(score.date).toISOString(),
                lineItem: {
                    sourcedId: score.lineItemSourcedId
                },
                student: {
                    sourcedId: score.studentSourcedId
                }
            }
        }
    },
    createResultFromFinalGrade: (grade) => {
        let result = {
            result: {
                scoreDate: moment(grade.date).toISOString(),
                lineItem: {
                    sourcedId: grade.lineItemSourcedId
                },
                student: {
                    sourcedId: grade.studentSourcedId
                },
                comment: grade.comment
            }
        };

        if(grade.percent) {
            result.result.score = grade.percent;
        }

        if(grade.score) {
            result.result.metadata = {
                ext_infiniteCampus_scoreGrade: grade.score
            };
        }

        console.log(result);
        return result;
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
    },
    addVendorAuthHeader: (headers, vendorKey, vendorSecret) => {
        headers['X-Vendor-Authorization'] = vendorKey + ':' + vendorSecret;
        return headers;
    }
}