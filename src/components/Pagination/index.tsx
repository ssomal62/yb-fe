import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import './style.css'
import {Pagination} from "@nextui-org/react";
interface Props {
    currentPage: number;
    currentSection: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setCurrentSection: Dispatch<SetStateAction<number>>;
    onPageChange: (page: number) => void;
    viewPageList: number[];
    totalSection: number;
}
export default function PaginationComponent(props: Props) {

    const { currentPage, currentSection, viewPageList , totalSection } = props;
    const { setCurrentPage, setCurrentSection , onPageChange} = props;
    const [page, setPage] = useState<number>(currentPage);
    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    }

    const onPreviousClickHandler = () => {
        if(currentSection === 1) return;
        setCurrentPage((currentSection -1) * 10);
        setCurrentSection(currentSection -1);
    }

    const onNextClickHandler = () => {
        if(currentSection === totalSection) return;
        setCurrentPage(currentSection * 10 + 1);
        setCurrentSection(currentSection + 1);
    }

    const handlePageChange = (page:number) => {
        setPage(page);
        onPageChange(page);
        window.scrollTo({ top: 878, behavior: 'smooth' });
    }

    return(
        <div id='pagination-wrapper'>
            <Pagination
                showControls
                variant='light'
                color="warning"
                page={page}
                onChange={handlePageChange}
                total={viewPageList.length}
            />
        </div>
    );
}
