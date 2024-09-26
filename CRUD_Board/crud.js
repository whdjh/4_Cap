document.addEventListener("DOMContentLoaded", () => {
	const postForm = document.getElementById("postForm");
	const postTitle = document.getElementById("postTitle");
	const postContent = document.getElementById("postContent");
	const postsList = document.getElementById("postsList");

	let posts = [];

	postForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const title = postTitle.value.trim();
		const content = postContent.value.trim();

		if(title && content) {
			const post = {
				title: title,
				content: content
			};

			posts.push(post);
			renderPosts();
			postForm.reset();
		}
	});

	function renderPosts(){
		postsList.innerHTML= "";
		posts.forEach(post => {
			const li = document.createElement("li");
			li.setAttribute("data-id", post.id);
			
			const title = document.createElement("h3");
			title.textContent = post.title;

			const content = document.createElement("p");
			content.textContent = post.content;

			const editBtn = document.createElement("button");
			editBtn.textContent = "수정";
			editBtn.addEventListener("click", () => editPost(post.id));

			const delBtn = document.createElement("button");
			delBtn.textContent = "삭제";
			delBtn.addEventListener("click", () => delPost(post.id));

			li.appendChild(title);
			li.appendChild(content);
			li.appendChild(editBtn);
			li.appendChild(delBtn);

			postsList.appendChild(li);
		})
	}

	function editPost(id) {
		const post = posts.find(post => post.id === id);

		if(post) {
			postTitle.value = post.title;
			postContent.value = post.content;
			// 업데이트하는것을 제거함
			delPost(id);
		}
	}

	function delPost(id) {
		posts = posts.filter(post => post.id !== id);

		renderPosts();
	}

	renderPosts();
});