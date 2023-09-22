import pb from '@/api/pocketbase';
import useContentData from './useContentData';

function useDeleteComment(comments) {
  const { refetch } = useContentData();

  const handleDeleteComment = async (collection, recordId) => {
    if (
      confirm(
        `${collection === 'comments' ? '댓글' : '답글'}을 삭제하시겠습니까?`
      )
    ) {
      collection === 'comments'
        ? setComments((comments) =>
            comments.filter((comment) => comment.id !== recordId)
          )
        : setComments((comments) =>
            comments.map(
              (comment) =>
                (comment.reply = comment.reply.filter(
                  (replyId) => replyId !== recordId
                ))
            )
          );

      await pb.collection(collection).delete(recordId);

      comments.forEach((comment) =>
        comment.id === recordId && comment.reply.length > 0
          ? comment.reply.forEach(
              async (reply) => await pb.collection('reply').delete(reply)
            )
          : null
      );

      await refetch();

      return;
    }

    return;
  };
  return { handleDeleteComment };
}

export default useDeleteComment;
