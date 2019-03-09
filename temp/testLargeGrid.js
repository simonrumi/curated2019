function handleNav(destination) {
		window.scrollBy({
		top: destination.top,
		left: destination.left,
		behavior: 'smooth'
	});

	if (window.pageYOffset) {
		window.pageXOffset = destination.left || 0;
		window.pageYOffset = destination.top || 0;
	} else if (document.documentElement.scrollTop) {
		document.documentElement.scrollLeft = destination.left || 0;
		document.documentElement.scrollTop = destination.top || 0;
	} else if (document.body.scrollTop) {
		document.body.scrollLeft = destination.left || 0;
		document.body.scrollTop = destination.top || 0;
	}
}


/*function scroll() {
	// where is the Y scroll currnetly?
	let yScrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	let xScrollPosition = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    if ((offset - document.documentElement.scrollTop) > 0) {
        document.documentElement.scrollTop += 10
    }
    else if ((offset - document.documentElement.scrollTop) < 0) {
        document.documentElement.scrollTop -= 10
    }
    else {
        clearInterval(call)
    }
};*/
