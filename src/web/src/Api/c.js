import { SSE } from "sse.js";
import request from "../Service/Request";
import uuid from "uuid";

const token = process.env.REACT_APP_TOKEN
const url = (process.env.REACT_APP_BASEURL || "") + "/api/study/run";

export const RunScript = (course_id,lesson_id,input,input_type,onMessage) => {

  var request_id = uuid.uuid4().hex
  var source = new SSE(url + "?token=" + token, {
    headers: { "Content-Type": "application/json", "X-Request-ID": request_id },
    payload: JSON.stringify({
        course_id,lesson_id,input,input_type
    }),
  });
  source.onmessage = (event) => {
    try {
      // var response = eval('('+event.data+")")
      var response = JSON.parse(event.data);
      // console.log("response", response);
      if (onMessage) {
        onMessage(response);
      }
    } catch (e) {
      console.log("error", e);
    }
  };
  source.onerror = (event) => {
  };
  source.onclose = (event) => {
  };
  source.onopen = (event) => {
  };
  source.close = () => {
  };
  source.stream();
  return source;
};





export const getLessonStudyRecord = async (lesson_id) => {
  return request({
    url: "/api/study/get_lesson_study_record?lesson_id="+ lesson_id,
    method: "get",
  });
}
