import config from '../config.json';
import type { StudentProfile } from '../interface/StudentProfile';

const getServiceTicket = async (serviceUrl: string, username: string, password: string) => {
  const data = new URLSearchParams({ username, password }).toString();
  const service = new URLSearchParams({
    service: serviceUrl,
  }).toString();

  const svcTicketReq = await fetch(config.endpoints.cas, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: data,
  });

  if (svcTicketReq.status === 201) {
    const svcReqLoc = svcTicketReq.headers.get('Location');
    if (svcReqLoc) {
      const svcData = await fetch(svcReqLoc, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json, text/plain, */*',
        },
        method: 'POST',
        body: service,
      });
      if (svcData) {
        return svcData.text();
      } else {
        return 'Failed to get data';
      }
    }
  } else if (svcTicketReq.status === 200) {
    return svcTicketReq.text();
  } else if (svcTicketReq.status === 401) {
    throw new Error('Not authorized');
  }
  throw new Error('Service API cannot be found');
};

const getStudentProfile = async (username: string, password: string): Promise<StudentProfile> => {
  const serviceTicket = await getServiceTicket(config.services.student.profile, username, password);
  const profile = await fetch(`${config.services.student.profile}?ticket=${serviceTicket}`);
  return profile.json();
};

const markAttendix = async (username: string, password: string, digits: string) => {
  const gqlQuery = {
    operationName: 'updateAttendance',
    variables: { otp: digits },
    query:
      'mutation updateAttendance($otp: String!) {\n  updateAttendance(otp: $otp) {\n    id\n    attendance\n    classcode\n    date\n    startTime\n    endTime\n    classType\n    __typename\n  }\n}\n',
  };
  const serviceTicket = await getServiceTicket(config.services.attendix, username, password);

  const response = await fetch(config.endpoints.attendix, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      ticket: serviceTicket,
      'X-Api-Key': config.apiKeys.awsAmplify,
      'x-amz-user-agent': 'aws-amplify/2.0.7',
    },
    method: 'POST',
    body: JSON.stringify(gqlQuery),
  });
  return response.json();
};

export { getServiceTicket, getStudentProfile, markAttendix };

