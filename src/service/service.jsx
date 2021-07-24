export const fetchJobDetails = (data, callback, errorFunc) => {
  fetch("https://www.zippia.com/api/jobs/", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(
      (result) => {
        return callback(result.jobs);
      },
      // handle errors here
      (error) => {
        return errorFunc(error);
      }
    )
}