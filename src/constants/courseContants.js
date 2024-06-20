export const LESSON_STATUS = {
  PREPARE_LEARNING: '可学习',
  NOT_START: '未开始',
  LOCKED: '未解锁',
  LEARNING: '正在学',
  COMPLETED: '已完成',
}

// 输入交互类型
export const INPUT_TYPE = {
  START: 'START',
  CONTINUE: 'continue', // 下一步
  TEXT: 'text', // 文本
  BUTTONS: 'buttons', // 按钮组
  ACTION: 'action', // 特殊动作
  SELECT: 'select',
};

// 输入交互的子类型
export const INPUT_SUB_TYPE = {
  NEXT_CHAPTER: 'next_chapter', // 跳转下一章
}

export const INPUT_ACTION_TYPE = {
  NEXT_CHAPTER: 'next_chapter', // 跳转下一章
}

// sse 返回的事件类型
export const RESP_EVENT_TYPE = {
  TEXT: 'text',
  TEXT_END: 'text_end',
  BUTTONS: 'buttons',
  INPUT: 'input',
  LESSON_UPDATE: 'lesson_update',
  CHAPTER_UPDATE: 'chapter_update',
}
