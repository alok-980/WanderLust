(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

// Function to toggle the review's full text on and off
function toggleReview(reviewId) {
  const reviewComment = document.getElementById(`review-comment-${reviewId}`);
  const seeMoreBtn = document.getElementById(`see-more-${reviewId}`);
  if (reviewComment.style.maxHeight === "none") {
      reviewComment.style.maxHeight = "100px";
      seeMoreBtn.innerHTML = "See More";
  } else {
      reviewComment.style.maxHeight = "none";
      seeMoreBtn.innerHTML = "See Less";
  }
}



