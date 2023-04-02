const loadfile = (post) => {
    if (post.body && typeof post.body === 'object') {
        return post;
    }

    const fileContent = post.content && JSON.parse(post.content);
    return { ...post, ...fileContent };
};

export default loadfile;
