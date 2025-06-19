const AWS = require("aws-sdk");


const get = async function (parameterNames, isWithDecryption) {
  const ssm = new AWS.SSM({ region: 'ap-southeast-2' });

  try {
    const response = await ssm.getParameters({
      Names: parameterNames,
      WithDecryption: isWithDecryption
    }).promise();

    return formatParameters(response);

  } catch (e) {
    console.error(`An error occured trying to retrieve SSM parameter ${parameterNames}`)
    console.log(e);
  }
}

module.exports = { get };

const formatParameters = (parameters) => {
  return parameters.Parameters.reduce((object, param) => {
    return { ...object, [param.Name]: param.Value };
  }, {});
};