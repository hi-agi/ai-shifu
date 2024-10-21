import { SSE } from "sse.js";
import request from "../Service/Request";
import { tokenStore } from "Service/storeUtil.js";
import { v4 } from "uuid";

export const runScript = (course_id, lesson_id, input, input_type, script_id, onMessage) => {
  const source = new SSE(`${process.env.REACT_APP_BASEURL || ''}/api/study/run?token=${tokenStore.get()}`, {
    headers: { "Content-Type": "application/json", "X-Request-ID": v4().replace(/-/g, '') },
    payload: JSON.stringify({
      course_id, lesson_id, input, input_type, script_id,
    }),
  });
  source.onmessage = (event) => {
    try {
      var response = JSON.parse(event.data);
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




/**
 * 获取课程学习记录
 * @param {*} lessonId
 * @returns
 */
export const getLessonStudyRecord = async (lessonId) => {
  return request({
    url: "/api/study/get_lesson_study_record?lesson_id=" + lessonId,
    method: "get",
  });
}
