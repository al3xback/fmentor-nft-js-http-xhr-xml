import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/4c136702c7439539a813392d33ec79d6/raw/4ef061c8a1c8cc2517d0427d8815ac0a45815e55/nft-data.xml';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const dataDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (name) => {
		const element = dataDoc.getElementsByTagName(name)[0];
		const hasChildren = !!element.children.length;
		if (hasChildren) {
			return [...element.children].map(
				(item) => item.childNodes[0].nodeValue
			);
		}
		return element.childNodes[0].nodeValue;
	};

	const image = getElementValue('image');
	const title = getElementValue('title');
	const description = getElementValue('description');
	const ethereumAmount = getElementValue('ethereum_amount');
	const remainingTime = getElementValue('remaining_time');
	const authorInfo = getElementValue('author');

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
	cardAuthorImageEl.src = './images/' + authorInfo[1];
	cardAuthorImageEl.alt = authorInfo[0];

	const cardAuthorNameEl = cardEl.querySelector('.card__author-desc a');
	cardAuthorNameEl.textContent = authorInfo[0];

	removeLoading();
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
