import { sendHttpRequest } from './util.js';

const mainContainerEl = document.querySelector('main .container');
const cardTemplate = document.getElementById('card-template');

const URL =
	'https://gist.githubusercontent.com/al3xback/4c136702c7439539a813392d33ec79d6/raw/f9413de6ba10c7526524e0182eacc973c67abc3c/nft-data.xml';

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const cardDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (el) => {
		return cardDoc.getElementsByTagName(el)[0].childNodes[0].nodeValue;
	};

	const image = getElementValue('image');
	const title = getElementValue('title');
	const description = getElementValue('description');
	const ethereumAmount = getElementValue('ethereum_amount');
	const remainingTime = getElementValue('remaining_time');
	const authorName = getElementValue('author_name');
	const authorImage = getElementValue('author_image');

	const cardEl = document.importNode(cardTemplate.content, true);

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

	mainContainerEl.appendChild(cardEl);
};

sendHttpRequest('GET', URL, renderCardContent);
