// 게시판 기능 구현 완료
document.addEventListener("DOMContentLoaded", () => {
	const postForm = document.getElementById("postForm");
	const postTitle = document.getElementById("postTitle");
	const postContent = document.getElementById("postContent");
	const postFile = document.getElementById("postFile"); 
	const postsList = document.getElementById("postsList");
	let posts = [];
  
	postForm.addEventListener("submit", (e) => {
	  e.preventDefault();
	  const title = postTitle.value.trim();
	  const content = postContent.value.trim();
	  const file = postFile.files[0]; 
  
	  if (title && content) {
			if (file && file.type === "application/zip") {
		  	const reader = new FileReader();
		  	reader.onload = function () {
					const fileData = reader.result; 
  
					const post = {
			  		id: Date.now(),
			  		title: title,
			  		content: content,
			  		fileName: file.name,
			  		fileData: fileData 
					};
					posts.push(post);
					renderPosts();
					postForm.reset();
		  	};
		  	reader.readAsDataURL(file); 
			} 
			else {
		  	const post = {
					id: Date.now(), 
					title: title,
					content: content,
					fileName: null, 
					fileData: null
		  	};
		  	posts.push(post);
		  	renderPosts();
		  	postForm.reset();
			}
	  }
	});
  
	function renderPosts() {
	  postsList.innerHTML = "";
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
  
		if(post.fileData) {
		  const downloadLink = document.createElement("a");
		  downloadLink.href = post.fileData; 
		  downloadLink.download = post.fileName; 
		  downloadLink.textContent = `Download ${post.fileName}`;
		  li.appendChild(downloadLink);
		}
  
		li.appendChild(editBtn);
		li.appendChild(delBtn);
		postsList.appendChild(li);
	  });
	}
  
	function editPost(id) {
	  const post = posts.find(post => post.id === id);
	  if (post) {
			postTitle.value = post.title;
			postContent.value = post.content;
			delPost(id); 
	  }
	}
  
	function delPost(id) {
	  posts = posts.filter(post => post.id !== id);
	  renderPosts();
	}
  
	renderPosts();
});