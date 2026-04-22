export const getGoblinLineByLesson = (lessonId) =>
  api.get(`/goblinLine/lesson/${lessonId}`);



// CREATE (admin)
export const addGoblinLine = (data) =>
  api.post("/goblinLine", data);

// UPDATE (admin)
export const updateGoblinLine = (id, data) =>
  api.put(`/goblinLine/${id}`, data);

// DELETE (admin)
export const deleteGoblinLine = (id) =>
  api.delete(`/goblinLine/${id}`);