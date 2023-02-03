import previews from '@/styles/Preview.module.css'

import {titleInformation,authorInformation,contentInformation,mdParser} from './index'

import * as React from 'react';
import useLocalStorage from 'use-local-storage'
import { useEffect } from 'react'

const TemplatePage = () => {
  const [titlebar, setTitlebar] = useLocalStorage<titleInformation>('titlebarStorage',{ titlenames: '', subtitles: '' });
  const [authors, setAuthors] = useLocalStorage<authorInformation[]>('authorsStorage',[]);
  const [contents, setContents] = useLocalStorage<contentInformation[]>('contentsStorage',[]);
  
  return (
    <>
        <div className={previews.paperPreview}>

            <div className={previews.titlebarContainerPreview}>
            <div className={previews.titlePreview}>
                <i>{titlebar.titlenames}</i>
            </div>
            <div className={previews.subtitlePreview} id="SubTitle" title="Preview Sub-Title">
                <i>{titlebar.subtitles}</i>
            </div>
            </div>

            <div className={previews.authorContainerPreview} id="AuthorContainer">
            {authors.map((author, idx) => (
                <div className={previews.authorPreview} key={idx.toString()}>
                <p>{author.names}</p>
                <p>{author.emails}</p>
                <p>{author.colleges}</p>
                </div>
            ))}
            </div>

            <div className={previews.contentContainerPreview} id="ContentContainer">
            {contents.map((content, idx) => (
                
                <div className={previews.contentBoxPreview} key={idx.toString()}>
                <div className={previews.contentHeaderPreview} id={idx + "ch"}>{content.headers}</div>
                <div className={previews.contentBodyPreview} id={idx + "cb"} dangerouslySetInnerHTML={{ __html: mdParser.render(content.infos) }}>
                </div>
                </div>
            ))}
            </div>

        </div>
    </>
  );
}

export default TemplatePage;