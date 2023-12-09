import fs from "fs";
import path from "path";

type Hand = {
  cards: string;
  bid: number;
};

type Card = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

type CardExcludingJ = Exclude<Card, "J">;

type CardCounts = Record<Card, number>;

type CardCountsExcludingJ = Record<CardExcludingJ, number>;

enum HandRank {
  FiveOfAKind = 7,
  FourOfAKind = 6,
  FullHouse = 5,
  ThreeOfAKind = 4,
  TwoPairs = 3,
  OnePair = 2,
  HighCard = 1,
}

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const hands: Hand[] = input.split("\n").map(line => {
  const [cards, bid] = line.split(" ");
  return { cards, bid: parseInt(bid) };
});

function countCards(cards: string) {
  return cards.split("").reduce((counts, card) => {
    if (card in counts) counts[card as Card]! += 1;
    else counts[card as Card] = 1;
    return counts;
  }, {} as CardCounts);
}

function numberOfPairs(cardObj: CardCounts, jokersAsWildCards: boolean) {
  const { J, ...cardsWithoutJokers } = cardObj;
  return jokersAsWildCards
    ? Object.values(cardsWithoutJokers).filter(item => item === 2).length
    : Object.values(cardObj).filter(item => item === 2).length;
}

function hasNumberOfCards(cardObj: CardCounts | CardCountsExcludingJ, num: number) {
  return Object.values(cardObj).includes(num);
}

function biggestNumberOfSameCard(cardObj: CardCounts) {
  const { J, ...cardsWithoutJokers } = cardObj;
  return Object.values(cardsWithoutJokers).sort().at(-1)!;
}

function checkHand(cardObj: CardCounts, jokersAsWildCards: boolean) {
  const { J: jokers, ...cardsWithoutJokers } = cardObj;
  const pairs = numberOfPairs(cardObj, jokersAsWildCards);

  if (jokersAsWildCards) {
    if (hasNumberOfCards(cardObj, 5) || biggestNumberOfSameCard(cardObj) + jokers === 5) return HandRank.FiveOfAKind;
    if (hasNumberOfCards(cardObj, 4) || biggestNumberOfSameCard(cardObj) + jokers === 4) return HandRank.FourOfAKind;
    if (
      (hasNumberOfCards(cardsWithoutJokers, 3) && hasNumberOfCards(cardsWithoutJokers, 2)) ||
      (jokers === 2 && pairs === 1) ||
      (jokers === 1 && pairs === 2)
    ) {
      return HandRank.FullHouse;
    }
    if (hasNumberOfCards(cardsWithoutJokers, 3) || biggestNumberOfSameCard(cardObj) + jokers === 3)
      return HandRank.ThreeOfAKind;
    if (pairs === 2 || (pairs === 1 && jokers === 1)) return HandRank.TwoPairs;
    if (pairs === 1 || jokers === 1) return HandRank.OnePair;
  } else {
    if (hasNumberOfCards(cardObj, 5)) return HandRank.FiveOfAKind;
    if (hasNumberOfCards(cardObj, 4)) return HandRank.FourOfAKind;
    if (hasNumberOfCards(cardObj, 3) && hasNumberOfCards(cardObj, 2)) return HandRank.FullHouse;
    if (hasNumberOfCards(cardObj, 3)) return HandRank.ThreeOfAKind;
    if (pairs === 2) return HandRank.TwoPairs;
    if (pairs === 1) return HandRank.OnePair;
  }

  return HandRank.HighCard;
}

function firstIsStronger(cards1: string, cards2: string, jokersAsWildCards: boolean) {
  const cardOrder: Card[] = jokersAsWildCards
    ? ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"]
    : ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

  for (let i = 0; i < cards1.length; i++) {
    const card1 = cards1[i] as Card;
    const card2 = cards2[i] as Card;
    if (card1 === card2) continue;
    return cardOrder.indexOf(card1) < cardOrder.indexOf(card2);
  }
}

function compareHands(hand1: CardCounts, hand2: CardCounts, jokersAsWildCards: boolean) {
  return checkHand(hand1, jokersAsWildCards) - checkHand(hand2, jokersAsWildCards);
}

function sortByCards(cards1: string, cards2: string, jokersAsWildCards: boolean) {
  const cardCounts1 = countCards(cards1);
  const cardCounts2 = countCards(cards2);

  const comparisonResult = compareHands(cardCounts1, cardCounts2, jokersAsWildCards);
  if (comparisonResult !== 0) return comparisonResult;

  // Fallback to comparing individual cards if hands are of equal strength
  return firstIsStronger(cards1, cards2, jokersAsWildCards) ? 1 : -1;
}

function sortHands(hands: Hand[], jokersAsWildCards: boolean) {
  return hands.toSorted((a, b) => sortByCards(a.cards, b.cards, jokersAsWildCards));
}

function calculateTotalWinnings(hands: Hand[], jokersAsWildCards: boolean) {
  return sortHands(hands, jokersAsWildCards).reduce((winnings, hand, index) => winnings + (index + 1) * hand.bid, 0);
}

console.log(calculateTotalWinnings(hands, false));
console.log(calculateTotalWinnings(hands, true));
