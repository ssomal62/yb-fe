import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import './style.css'
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH,
    BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "../../constant";
import {Cookies} from "react-cookie";
import {useBoardStore, useLoginUserStore} from "../../stores";
import {fileUploadRequest, patchBoardRequest, postBoardRequest, signOutRequest} from "../../apis";
import {PatchBoardRequestDto, PostBoardRequestDto} from "../../apis/request/board";
import {PatchBoardResponseDto, PostBoardResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {SignOutRequestDto} from "../../apis/request/auth";
import {SignOutResponseDto} from "../../apis/response/auth";
import {IoOptionsOutline} from "react-icons/io5";
import {
    Button,
    Checkbox,
    CheckboxGroup,
    DateRangePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Radio,
    RadioGroup,
    Slider
} from "@nextui-org/react";
import {SearchIcon} from "./SearchIcon";
import {AiOutlineLike} from "react-icons/ai";

export default function Header() {

    const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();

    const {pathname} = useLocation();

    const cookies = new Cookies();
    const [isLogin, setLogin] = useState<boolean>(false);

    const [pageState, setPageState] = useState({
        isAuthPage: false,
        isMainPage: false,
        isSearchPage: false,
        isBoardDetailPage: false,
        isBoardWritePage: false,
        isBoardUpdatePage: false,
        isUserPage: false
    });

    const navigate = useNavigate();

    const onLogoClickHandler = () => {
        navigate(MAIN_PATH());
    }
    const SearchButton = () => {
        const searchButtonRef = useRef<HTMLDivElement | null>(null);

        const [status, setStatus] = useState<boolean>(false);
        const [word, setWord] = useState<string>('');
        const [showOption, setShowOption] = useState(false);

        const {searchWord} = useParams()

        const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setWord(value)
        };
        const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!searchButtonRef.current) return;
            searchButtonRef.current.click();
            navigate(SEARCH_PATH(word));
        };
        const onSearchButtonClickHandler = () => {
            if (word === '') {

                return;
            }

            navigate(SEARCH_PATH(word));
        };

        const onOptionClickHandler = () => {
            setShowOption(!showOption);
        }
        useEffect(() => {
            if (searchWord) {
                setWord(searchWord);
                setStatus(false);
            }
        }, [searchWord]);


        return (
            <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Dropdown showArrow backdrop='opaque'>
                        <DropdownTrigger>
                            <Button isIconOnly size='md' variant='light' color='warning' className="capitalize"
                                    startContent={<IoOptionsOutline onClick={() => onOptionClickHandler()} style={{
                                        width: '24px',
                                        height: '24px',
                                        color: 'black'
                                    }}/>}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Multiple selection"
                            color='warning'
                            variant="light"
                            closeOnSelect={false}
                            className="p-3"
                            itemClasses={{
                                base: [
                                    "rounded-md",
                                    "text-default-500",
                                    "transition-opacity",
                                    "data-[hover=true]:text-foreground",
                                    "data-[hover=true]:bg-default-100",
                                    "dark:data-[hover=true]:bg-default-50",
                                    "data-[selectable=true]:focus:bg-default-50",
                                    "data-[pressed=true]:opacity-70",
                                    "data-[focus-visible=true]:ring-default-500",
                                ],
                            }}
                        >
                            <DropdownSection title="검색 옵션" showDivider>
                                <DropdownItem key="searchContent">
                                    <CheckboxGroup orientation="horizontal" color='warning' size='sm'
                                                   defaultValue={["subject"]}>
                                        <Checkbox value={"subject"}>제목</Checkbox>
                                        <Checkbox value={"content"}>내용</Checkbox>
                                        <Checkbox value={"nickname"}>닉네임</Checkbox>
                                    </CheckboxGroup>
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="기간 조회" showDivider>
                                <DropdownItem key="range">
                                    <DateRangePicker
                                        className="max-w-xs"
                                        color='warning'
                                        variant='bordered'
                                        visibleMonths={3}
                                    />
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection showDivider>
                                <DropdownItem key="favorite">
                                    <Slider
                                        label={'좋아요'}
                                        startContent={<AiOutlineLike style={{width: '24px', height: '24px'}}/>}
                                        radius='lg'
                                        size='sm'
                                        step={5}
                                        showSteps={true}
                                        maxValue={100}
                                        minValue={0}
                                        defaultValue={1}
                                        aria-label="?"
                                        color='warning'
                                        className="max-w-md"
                                    />
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection>
                                <DropdownItem key="searchContent">
                                    <RadioGroup orientation="horizontal" color='warning' size='sm'
                                                defaultValue={"subject"}>
                                        <Radio value={"5"}>최신순</Radio>
                                        <Radio value={"1"}>댓글순</Radio>
                                        <Radio value={"1"}>조회순</Radio>
                                        <Radio value={"2"}>좋아요순</Radio>
                                    </RadioGroup>
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div>
                    <Input
                        // label="Search"
                        isClearable
                        radius="full"
                        onKeyDown={(e) => onSearchWordKeyDownHandler(e)}
                        onChange={(e) => onSearchWordChangeHandler(e)}
                        placeholder="검색어를 입력해주세요"
                        color='warning'
                        variant='bordered'
                        startContent={
                            <div ref={searchButtonRef} onClick={onSearchButtonClickHandler}>
                                <SearchIcon
                                    className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"/>
                            </div>
                        }
                    />
                </div>
            </>
        );
    }

    const MyPageButton = () => {
        const {userEmail} = useParams();
        const onMyPageButtonClickHandler = () => {
            if (loginUser) {
                navigate(USER_PATH(loginUser.email));
            }
        }

        const signOutResponse = (responseBody: SignOutResponseDto | ResponseDto | null) => {
            if (!responseBody) {
                alert('네트워크 이상입니다.');
                return;
            }

            const {code} = responseBody;

            if (code === 'DBE') alert('데이터베이스 오류입니다');
            if (code !== 'SU') return;
        }

        const onSignOutButtonClickHandler = () => {
            const accessToken = cookies.get('accessToken');
            const refreshToken = cookies.get('refreshToken');
            const requestBody: SignOutRequestDto = {accessToken, refreshToken};
            signOutRequest(requestBody).then(signOutResponse);

            resetLoginUser();
            cookies.remove('accessToken', {path: '/'});
            cookies.remove('refreshToken', {path: '/'});
            navigate(MAIN_PATH());
        }

        const onSignInButtonClickHandler = () => {
            navigate(AUTH_PATH());
        }

        if (isLogin && userEmail === loginUser?.email)
            return <Button color='warning' radius='full' variant='bordered' onClick={onSignOutButtonClickHandler}
                           style={{width: '120px'}}>{'로그아웃'}</Button>

        if (isLogin)
            return <Button color='warning' radius='full' variant='bordered' onClick={onMyPageButtonClickHandler}
                           style={{width: '120px'}}>{'마이페이지'}</Button>
        return <Button color='warning' radius='full' variant='bordered' onClick={onSignInButtonClickHandler}
                       style={{width: '120px'}}>{'로그인'}</Button>
    };

    const UploadButton = () => {
        const {boardNumber} = useParams();
        const {title, content, boardImageFileList, resetBoard} = useBoardStore();
        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.')
            if (code === 'AF' || code === 'NU') navigate(AUTH_PATH());
            if (code === 'VF') alert('제목과 내용은 필수입니다.');
            if (code !== 'SU') return;

            resetBoard();
            if (!loginUser) return;
            const {email} = loginUser;
            navigate(USER_PATH(email));
        }

        const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'DBE') alert('데이터베이스 오류입니다.')
            if (code === 'AF' || code === 'NU' || code === 'NB' || code === 'NP') navigate(AUTH_PATH());
            if (code === 'VF') alert('제목과 내용은 필수입니다.');
            if (code !== 'SU') return;

            if (!boardNumber) return;
            navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
        }
        const onUploadButtonClickHandler = async () => {
            const accessToken = cookies.get('accessToken');
            if (!accessToken) return;

            const boardImageList: string[] = [];
            for (const file of boardImageFileList) {
                const data = new FormData();
                data.append('file', file);
                const url = await fileUploadRequest(data);
                if (url) boardImageList.push(url);
            }

            const isWriterPage = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();
            if (isWriterPage) {
                const requestBody: PostBoardRequestDto = {
                    title, content, boardImageList
                }
                postBoardRequest(requestBody).then(postBoardResponse);
            } else {
                if (!boardNumber) return;
                const requestBody: PatchBoardRequestDto = {
                    title, content, boardImageList
                }
                patchBoardRequest(requestBody, boardNumber).then(patchBoardResponse);
            }
        }

        if (title && content)
            return <Button color='warning' variant='bordered' radius='full' style={{width: '120px'}}
                           onClick={onUploadButtonClickHandler}>{'업로드'}</Button>
        return (
            <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                    <Button color='warning' variant='bordered' radius='full' style={{width: '120px'}}>{'업로드'}</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="px-1 py-2">
                        <div className="text-small font-bold">제목과 본문을 작성해주세요</div>
                    </div>
                </PopoverContent>
            </Popover>
        )

    }

    useEffect(() => {
        const newState = {
            isAuthPage: pathname.startsWith(AUTH_PATH()),
            isMainPage: pathname === MAIN_PATH(),
            isSearchPage: pathname.startsWith(SEARCH_PATH('')),
            isBoardDetailPage: pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH('')),
            isBoardWritePage: pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH()),
            isBoardUpdatePage: pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH('')),
            isUserPage: pathname.startsWith(USER_PATH(''))
        };
        setPageState(newState);
    }, [pathname]);

    useEffect(() => {
        setLogin(loginUser !== null);
    }, [loginUser]);

    return (
        <div id='header'>
            <div className='header-container'>
                <div className='header-left-box' onClick={onLogoClickHandler}>
                    <div className='icon-box-middle'>
                        <div className='icon logo-yellow'></div>
                    </div>
                    <div className='header-logo'>{'Yellow Board'}</div>
                </div>
                <div className='header-right-box'>
                    {
                        (
                            pageState.isAuthPage ||
                            pageState.isBoardWritePage ||
                            !pageState.isBoardUpdatePage ||
                            pageState.isBoardDetailPage
                        ) &&
                        <SearchButton/>
                    }
                    {
                        (
                            pageState.isMainPage ||
                            pageState.isSearchPage ||
                            pageState.isBoardDetailPage ||
                            pageState.isUserPage
                        ) &&
                        <MyPageButton/>
                    }
                    {
                        (pageState.isBoardWritePage || pageState.isBoardUpdatePage) &&
                        <UploadButton/>
                    }
                </div>
            </div>
        </div>
    )
}
