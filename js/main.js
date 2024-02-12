import { sendHttpRequest } from './util.js';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const loadingEl = document.querySelector('.loading');

const URL =
	'https://gist.githubusercontent.com/al3xback/4c136702c7439539a813392d33ec79d6/raw/6bdb5f77cbcbdfc3d09f7cb462647e239404f5bb/nft-data.xml';

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.textContent = msg;
	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const dataDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (el) => {
		return dataDoc.getElementsByTagName(el)[0].childNodes[0].nodeValue;
	};

	const image = getElementValue('image');
	const title = getElementValue('title');
	const description = getElementValue('description');
	const ethereumAmount = getElementValue('ethereum_amount');
	const remainingTime = getElementValue('remaining_time');
	const authorName = getElementValue('author_name');
	const authorImage = getElementValue('author_image');

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');

	const cardImageEl = cardEl.querySelector('.card__image img');
	cardImageEl.src = './images/' + image;
	cardImageEl.alt = image.substring(0, image.indexOf('.'));

	const cardTitleEl = cardEl.querySelector('.card__title a');
	cardTitleEl.textContent = title;

	const cardDescEl = cardEl.querySelector('.card__desc');
	cardDescEl.textContent = description;

	const cardStatusItemEls = cardEl.querySelectorAll('.card__stats-list-item');
	const cardEthereumAmountEl = cardStatusItemEls[0];
	cardEthereumAmountEl.querySelector('span').textContent =
		ethereumAmount + ' ETH';
	const cardRemainingTimeEl = cardStatusItemEls[1];
	cardRemainingTimeEl.querySelector('span').textContent =
		remainingTime + ' days left';

	const cardAuthorImageEl = cardEl.querySelector('.card__author-img');
	cardAuthorImageEl.src = './images/' + authorImage;
	cardAuthorImageEl.alt = authorImage.substring(0, image.indexOf('.'));

	const cardAuthorNameEl = cardEl.querySelector('.card__author-desc a');
	cardAuthorNameEl.textContent = authorName;

	removeLoading();
	cardWrapperEl.appendChild(cardEl);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
