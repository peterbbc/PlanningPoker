import React from 'react';

import { Back } from './icons/Back';
import { Cards } from './icons/Cards';
import { Timer } from './icons/Timer';
import { ChevronDown } from './icons/ChevronDown';
import { Close } from './icons/Close';
import { ManageFacilitators } from './icons/ManageFacilitators';
import { Alert } from './icons/Alert';
import { Check } from './icons/Check';
import { Play } from './icons/Play';
import { Cog } from './icons/Cog';
import { Comment } from './icons/Comment';
import { LikeOutline } from './icons/LikeOutline';
import { LikeSolid } from './icons/LikeSolid';
import { ElipisisHoritzontal } from './icons/ElipisisHoritzontal';
import { ElipisisVertical } from './icons/ElipisisVertical';
import { Eye } from './icons/Eye';
import { Export } from './icons/Export';
import { Burger } from './icons/Burger';
import { Add } from './icons/Add';
import { Eye2 } from './icons/Eye2';
import { Hilfe } from './icons/Hilfe';
import { Import } from './icons/Import';
import { Top } from './icons/Top';
import { Info } from './icons/Info';
import { Invite } from './icons/Invite';
import { Issues } from './icons/Issues';
import { List } from './icons/List';
import { Detach } from './icons/Detach';
import { Login } from './icons/Login';
import { Reset } from './icons/Reset';
import { Upgrade } from './icons/Upgrade';
import { Downgrade } from './icons/Downgrade';
import { Logo } from './icons/Logo';
import { Link } from './icons/Link';
import { Open } from './icons/Open';
import { Pencil } from './icons/Pencil';
import { Plus } from './icons/Plus';
import { Save } from './icons/Save';
import { Shield } from './icons/Shield';
import { Trash } from './icons/Trash';
import { Union } from './icons/Union';
import { UserNew } from './icons/UserNew';
import { Restart } from './icons/Restart';
import { UserPlus } from './icons/UserPlus';
import { User } from './icons/User';
import { Camera } from './icons/Camera';

export type IconValue =
  | 'ellipsis-h'
  | 'ellipsis-v'
  | 'manage-facilitators'
  | 'save'
  | 'list'
  | 'back'
  | 'check'
  | 'timer'
  | 'link'
  | 'cog'
  | 'export'
  | 'play'
  | 'restart'
  | 'burger'
  | 'upgrade'
  | 'close'
  | 'cards'
  | 'eye'
  | 'eye2'
  | 'add'
  | 'trash'
  | 'comment'
  | 'open'
  | 'invite'
  | 'info'
  | 'camera'
  | 'top'
  | 'detach'
  | 'issues'
  | 'login'
  | 'alert'
  | 'like-outline'
  | 'like-solid'
  | 'import'
  | 'shield'
  | 'plus'
  | 'user-new'
  | 'union'
  | 'reset'
  | 'logo'
  | 'hilfe'
  | 'downgrade'
  | 'chevron-down'
  | 'pencil'
  | 'user-plus'
  | 'user';

// export enum IconValue {
//   ellipsisH = 'ellipsis-h',
//   ellipsisV = 'ellipsis-v',
//   manageFacilitators = 'manage-facilitators',
//   save = 'save',
//   list = 'list',
//   back = 'back',
//   check = 'check',
//   timer = 'timer',
//   link = 'link',
//   cog = 'cog',
//   export = 'export',
//   play = 'play',
//   restart = 'restart',
//   burger = 'burger',
//   upgrade = 'upgrade',
//   close = 'close',
//   cards = 'cards',
//   eye = 'eye',
//   eye2 = 'eye2',
//   add = 'add',
//   trash = 'trash',
//   comment = 'comment',
//   open = 'open',
//   invite = 'invite',
//   info = 'info',
//   camera = 'camera',
//   top = 'top',
//   detach = 'detach',
//   issues = 'issues',
//   login = 'login',
//   alert = 'alert',
//   likeOutline = 'like-outline',
//   likeSolid = 'like-solid',
//   import = 'import',
//   shield = 'shield',
//   plus = 'plus',
//   userNew = 'user-new',
//   union = 'union',
//   reset = 'reset',
//   logo = 'logo',
//   hilfe = 'hilfe',
//   downgrade = 'downgrade',
//   chevronDown = 'chevron-down',
//   pencil = 'pencil',
//   userPlus = 'user-plus',
//   user = 'user'
// }

interface IconProps {
  icon: IconValue;
}

export const Icon: React.FC<IconProps> = ({ icon }) => {
  switch (icon) {
    case 'user-plus': return <UserPlus />
    case 'user': return <User />
    case 'check': return <Check />
    case 'add': return <Add />
    case 'export': return <Export />
    case 'detach': return <Detach />
    case 'like-outline': return <LikeOutline />
    case 'like-solid': return <LikeSolid />
    case 'manage-facilitators': return <ManageFacilitators />
    case 'link': return <Link />
    case 'timer': return <Timer />
    case 'upgrade': return <Upgrade />
    case 'downgrade': return <Downgrade />
    case 'top': return <Top />
    case 'alert': return <Alert />
    case 'camera': return <Camera />
    case 'cog': return <Cog />
    case 'cards': return <Cards />
    case 'union': return <Union />
    case 'restart': return <Restart />
    case 'reset': return <Reset />
    case 'burger': return <Burger />
    case 'trash': return <Trash />
    case 'save': return <Save />
    case 'hilfe': return <Hilfe />
    case 'back': return <Back />
    case 'play': return <Play />
    case 'eye': return <Eye />
    case 'eye2': return <Eye2 />
    case 'list': return <List />
    case 'info': return <Info />
    case 'open': return <Open />
    case 'ellipsis-h': return <ElipisisHoritzontal />
    case 'ellipsis-v': return <ElipisisVertical />
    case 'pencil': return <Pencil />
    case 'comment': return <Comment />
    case 'login': return <Login />
    case 'shield': return <Shield />
    case 'logo': return <Logo />
    case 'import': return <Import />
    case 'user-new': return <UserNew />
    case 'close': return <Close />
    case 'invite': return <Invite />
    case 'issues': return <Issues />
    case 'plus': return <Plus />
    case 'chevron-down': return <ChevronDown />
  }
};

// export const Icon: React.FC<IconProps> = ({ icon }) => {
//   switch (icon) {
//      case IconValue.ellipsisH: return <ElipisisHoritzontal/>
//      case IconValue.ellipsisV: return <ElipisisVertical/>
//      case IconValue.manageFacilitators: return <ManageFacilitators/>
//      case IconValue.save: return <Save/>
//      case IconValue.list: return <List/>
//      case IconValue.back: return <Back/>
//      case IconValue.check: return <Check/>
//      case IconValue.timer: return <Timer/>
//      case IconValue.link: return <Link/>
//      case IconValue.cog: return <Cog/>
//      case IconValue.export: return <Export/>
//      case IconValue.play: return <Play/>
//      case IconValue.restart: return <Restart/>
//      case IconValue.burger: return <Burger/>
//      case IconValue.upgrade: return <Upgrade/>
//      case IconValue.close: return <Close/>
//      case IconValue.cards: return <Cards/>
//      case IconValue.eye: return <Eye/>
//      case IconValue.eye2: return <Eye2/>
//      case IconValue.add: return <Add/>
//      case IconValue.trash: return <Trash/>
//      case IconValue.comment: return <Comment/>
//      case IconValue.open: return <Open/>
//      case IconValue.invite: return <Invite/>
//      case IconValue.info: return <Info/>
//      case IconValue.camera: return <Camera/>
//      case IconValue.top: return <Top/>
//      case IconValue.detach: return <Detach/>
//      case IconValue.issues: return <Issues/>
//      case IconValue.login: return <Login/>
//      case IconValue.alert: return <Alert/>
//      case IconValue.likeOutline: return <LikeOutline/>
//      case IconValue.likeSolid: return <LikeSolid/>
//      case IconValue.import: return <Import/>
//      case IconValue.shield: return <Shield/>
//      case IconValue.plus: return <Plus/>
//      case IconValue.userNew: return <UserNew/>
//      case IconValue.union: return <Union/>
//      case IconValue.reset: return <Reset/>
//      case IconValue.logo: return <Logo/>
//      case IconValue.hilfe: return <Hilfe/>
//      case IconValue.downgrade: return <Downgrade/>
//      case IconValue.chevronDown: return <ChevronDown/>
//      case IconValue.pencil: return <Pencil/>
//      case IconValue.userPlus: return <UserPlus/>
//      case IconValue.user: return <User/>
//   }
// };