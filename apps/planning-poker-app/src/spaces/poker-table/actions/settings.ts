import {
  WhoCanShowCardsType,
  WhoCanEditIssuesType,
} from '@we-agile-you/types-planning-poker';
import firebase from 'firebase/compat/app';

interface Settings {
  deck: string[];
  name: string;
  whoCanShowCards: WhoCanShowCardsType;
  whoCanEditIssues: WhoCanEditIssuesType;
  ownerId: string;
}

export const changeSettings = (tableId: string, settings: Settings) =>
  firebase
    .firestore()
    .collection('poker-tables')
    .doc(tableId)
    .set(
      {
        ...settings,
      },
      { merge: true },
    );
