export const getComments = async (
  Threads: Threads,
  forks: thread["forkLabel"][]
) => {
  const { threads } = Threads;
  const comments: nv_comment[] = [];

  function f(fork: thread["forkLabel"]) {
    threads
      .filter((thread) => thread.fork === fork)
      .map((thread) => {
        thread.comments.map((comment) => {
          comments.push(comment);
        });
      });
  }

  for (const fork of forks) f(fork);

  return comments;
};

export function filterComments(comments: nv_comment[]) {
  return comments.filter((comment) => {
    return comment.score >= 0;
  });
}

export function sortComments(comments: nv_comment[]) {
  return comments.sort((a, b) => {
    return a.vposMs - b.vposMs;
  });
}
