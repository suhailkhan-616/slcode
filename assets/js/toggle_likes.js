class ToggleLike {
    constructor(toggleElement) {
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike() {
        $(this.toggler).click((e) => {
            e.preventDefault();

            const $toggler = $(this.toggler);

            $.ajax({
                type: 'POST',
                url: $toggler.attr('href'),
            })
            .done((data) => {
                let likesCount = parseInt($toggler.attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true) {
                    likesCount = likesCount - 1;
                } else {
                    likesCount = likesCount + 1;
                }

                $toggler.attr('data-likes', likesCount);
                $toggler.html(`${likesCount} Likes`);
            })
            .fail((errData) => {
                console.log('Error in completing the request');
            });
        });
    }
}
