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
  | 'ellipsis-h'
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

interface IconProps {
  icon: IconValue;
}

export const Icon: React.FC<IconProps> = ({ icon }) => {
  if (icon === 'user-plus') {
    return <UserPlus />;
  }
  if (icon === 'user') {
    return <User />;
  }
  if (icon === 'check') {
    return <Check />;
  }
  if (icon === 'add') {
    return <Add />;
  }
  if (icon === 'export') {
    return <Export />;
  }
  if (icon === 'detach') {
    return <Detach />;
  }
  if (icon === 'like-outline') {
    return <LikeOutline />;
  }
  if (icon === 'like-solid') {
    return <LikeSolid />;
  }
  if (icon === 'manage-facilitators') {
    return <ManageFacilitators />;
  }
  if (icon === 'link') {
    return <Link />;
  }
  if (icon === 'timer') {
    return <Timer />;
  }
  if (icon === 'upgrade') {
    return <Upgrade />;
  }
  if (icon === 'downgrade') {
    return <Downgrade />;
  }
  if (icon === 'top') {
    return <Top />;
  }
  if (icon === 'alert') {
    return <Alert />;
  }
  if (icon === 'camera') {
    return <Camera />;
  }
  if (icon === 'cog') {
    return <Cog />;
  }
  if (icon === 'cards') {
    return <Cards />;
  }
  if (icon === 'union') {
    return <Union />;
  }
  if (icon === 'restart') {
    return <Restart />;
  }
  if (icon === 'reset') {
    return <Reset />;
  }
  if (icon === 'burger') {
    return <Burger />;
  }
  if (icon === 'trash') {
    return <Trash />;
  }
  if (icon === 'save') {
    return <Save />;
  }
  if (icon === 'hilfe') {
    return <Hilfe />;
  }
  if (icon === 'back') {
    return <Back />;
  }
  if (icon === 'play') {
    return <Play />;
  }
  if (icon === 'eye') {
    return <Eye />;
  }
  if (icon === 'eye2') {
    return <Eye2 />;
  }
  if (icon === 'list') {
    return <List />;
  }
  if (icon === 'info') {
    return <Info />;
  }
  if (icon === 'open') {
    return <Open />;
  }
  if (icon === 'ellipsis-h') {
    return <ElipisisHoritzontal />;
  }
  if (icon === 'ellipsis-v') {
    return <ElipisisVertical />;
  }
  if (icon === 'pencil') {
    return <Pencil />;
  }
  if (icon === 'comment') {
    return <Comment />;
  }
  if (icon === 'login') {
    return <Login />;
  }
  if (icon === 'shield') {
    return <Shield />;
  }
  if (icon === 'logo') {
    return <Logo />;
  }
  if (icon === 'import') {
    return <Import />;
  }
  if (icon === 'user-new') {
    return <UserNew />;
  }
  if (icon === 'close') {
    return <Close />;
  }
  if (icon === 'invite') {
    return <Invite />;
  }
  if (icon === 'issues') {
    return <Issues />;
  }
  if (icon === 'plus') {
    return <Plus />;
  }
  if (icon === 'chevron-down') {
    return <ChevronDown />;
  }

  return null;
};
