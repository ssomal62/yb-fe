import React from "react";
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png'
import {BoardListItem} from "../../types/interface";
import {useNavigate} from "react-router-dom";
import {BOARD_DETAIL_PATH, BOARD_PATH} from "../../constant";
import {Avatar, Card, CardFooter, CardHeader, Chip, Image} from "@nextui-org/react";
import {AiOutlineComment, AiOutlineEye, AiOutlineLike} from "react-icons/ai";


interface Props {
    top3ListItem: BoardListItem
}

export default function Top3Item({top3ListItem}: Props) {

    const {boardNumber, title, content, boardTitleImage} = top3ListItem;
    const {favoriteCount, commentCount, viewCount} = top3ListItem;
    const {writeDateTime, writerNickname, writerProfileImage} = top3ListItem;

    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
    }

    return (
        <div onClick={onClickHandler}>
            <Card isFooterBlurred className="col-span-12 sm:col-span-7 top-3-list-item relative">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <Chip variant='flat' size='sm' color='warning'>{writeDateTime}</Chip>
                    <div className='ml-2'>
                        <div className="mt-2 text-white/90 font-semibold text-xl font-bold">{title}</div>
                        <div className="text-tiny text-white/60 uppercase font-bold">{content}</div>
                    </div>
                </CardHeader>
                <div className="bg-gradient-to-b from-black/50 to-black/0 z-100"></div>
                    <Image
                        removeWrapper
                        alt="Relaxing app background"
                        className="z-0 w-full h-full object-cover"
                        src={boardTitleImage ? boardTitleImage : defaultProfileImage}
                    />
                <CardFooter
                    className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 items-center">
                        <Avatar showFallback src={writerProfileImage ? writerProfileImage : defaultProfileImage}/>
                        <div className="flex flex-col text-white">
                            <div>
                                <div className="text-tiny ">{writerNickname}</div>
                            </div>
                            <div className='board-list-item-counts'>
                                <div className='board-list-item-counts-content text-white'>
                                    <AiOutlineComment className='mr-2'/> {commentCount}
                                </div>
                                <div className='board-list-item-counts-content text-white'>
                                    <AiOutlineLike className='mr-2'/> {favoriteCount}
                                </div>
                                <div className='board-list-item-counts-content text-white'>
                                    <AiOutlineEye className='mr-2'/> {viewCount}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
