import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import edits from '@/styles/Home.module.css'

import * as React from 'react';
import { useState,useEffect } from 'react';
import ReactMarkdown from 'react-markdown'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Editor, { Plugins } from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import DOMPurify from 'dompurify'


const inter = Inter({ subsets: ['latin'] })
export const mdParser = new MarkdownIt();
const plugins = [
  'font-bold',
  'font-italic',
  'font-underline',
  'divider',
  'list-unordered',
  'list-ordered',
  'block-code-block',
  'link',
  'image',
  'table',
  'logger'
];

interface titleInformation {
  titlenames: string,
  subtitles: string,
};

interface authorInformation {
  names: string,
  emails: string,
  colleges: string
};

interface contentInformation {
  headers: string,
  infos: string,
};

export default function Home() {

  // Display Modes
  const [displayType, setDisplayType] = useState(false);

  const blockMode = () => {
    var i: number = 0;
    while (i < contents.length) {
      if (document.getElementById(i + "cb")) {
        document.getElementById(i + "cb")!.style.maxHeight = "fit-content";
        i += 1;
      }
      else { break; }
    }
  }

  const scriptMode = () => {
    var i: number = 0;
    while (i < contents.length) {
      if (document.getElementById(i + "cb")) {
        document.getElementById(i + "cb")!.style.maxHeight = "calc(12.5em + 3px)";
        i += 1;
      }
      else { break; }
    }
  }

  const handleBadgeVisibility = () => {
    (displayType) ? scriptMode() : blockMode();
    setDisplayType(!displayType);
  };

  const [preview,setPreview] = useState(false)
  const previewMode = () => {
    setPreview(!preview);
    if(preview){
      document.getElementById("AddAuthor")!.style.display = "none";
      document.getElementById("ContentBoxAdd")!.style.display = "none";

      document.getElementById("TitleInputTextField")!.style.display = "none";
      document.getElementById("AuthorInputTextField")!.style.display = "none";
      document.getElementById("ContentInputTextField")!.style.display = "none";

      document.getElementById("TitleBar")!.style.pointerEvents = "none";
      document.getElementById("AuthorContainer")!.style.pointerEvents = "none";
      document.getElementById("ContentContainer")!.style.pointerEvents = "none";
      document.getElementById("SwitchSetter")!.style.pointerEvents = "none";

      setDisplayType(true);
      handleBadgeVisibility();

      resetAuthor();
      resetContent();
    } else {
      if(authors.length < 3) {document.getElementById("AddAuthor")!.style.display = "block";}
      document.getElementById("ContentBoxAdd")!.style.display = "block";

      document.getElementById("TitleBar")!.style.pointerEvents = "all";
      document.getElementById("AuthorContainer")!.style.pointerEvents = "all";
      document.getElementById("ContentContainer")!.style.pointerEvents = "all";
      document.getElementById("SwitchSetter")!.style.pointerEvents = "all";

      document.getElementById("PreviewButton")!.style.backgroundColor = "#a84593";
    }
  }

  // TitleBar Elements
  const [titlename, setTitlename] = useState('Title Placeholder');
  const [subtitle, setSubtitle] = useState('Subtitle Placeholder');

  const [titlebar, setTitlebar] = useState<titleInformation>({ titlenames: titlename, subtitles: subtitle });
  function updateTitlebar() {
    setTitlebar({ titlenames: titlename, subtitles: subtitle });
  }

  function addTitlebar() {
    document.getElementById("TitleInputTextField")!.style.display = "block";
    document.getElementById("AuthorInputTextField")!.style.display = "none";
    document.getElementById("ContentInputTextField")!.style.display = "none";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    document.getElementById("TitleBar")!.style.pointerEvents = "none";
    document.getElementById("AuthorContainer")!.style.pointerEvents = "none";
    document.getElementById("ContentContainer")!.style.pointerEvents = "none";
    document.getElementById("ModeSetter")!.style.pointerEvents = "none";

    document.getElementById("PreviewButton")!.style.backgroundColor = "#dddddd";
  }

  const handleSubmitTitle = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (titlename && subtitle) {
      updateTitlebar();

      document.getElementById("TitleInputTextField")!.style.display = "none";
      var access = document.getElementById("TitleBar");
      window.scrollTo({
        top: access?.scrollTop
      });

      document.getElementById("TitleBar")!.style.pointerEvents = "all";
      document.getElementById("AuthorContainer")!.style.pointerEvents = "all";
      document.getElementById("ContentContainer")!.style.pointerEvents = "all";
      document.getElementById("ModeSetter")!.style.pointerEvents = "all";

      document.getElementById("PreviewButton")!.style.backgroundColor = "#a84593";
    }
  }

  // Author Elements
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');

  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorCollege, setAuthorCollege] = useState('');

  const [authorClick, setAuthorClick] = useState(0);
  const [authorAdderText, setAuthorAdderText] = useState('Add Author');

  const [authors, setAuthors] = useState<authorInformation[]>([]); //Authors are stored in reverse order in list
  const authorLister = (author: authorInformation, i: number = authorClick) => {
    authors.splice(i, 0, author);
    setAuthors(authors);
  }

  const addAuthor = () => {
    document.getElementById("TitleInputTextField")!.style.display = "none";
    document.getElementById("AuthorInputTextField")!.style.display = "block";
    document.getElementById("ContentInputTextField")!.style.display = "none";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    document.getElementById("TitleBar")!.style.pointerEvents = "none";
    document.getElementById("AuthorContainer")!.style.pointerEvents = "none";
    document.getElementById("ContentContainer")!.style.pointerEvents = "none";
    document.getElementById("ModeSetter")!.style.pointerEvents = "none";

    document.getElementById("PreviewButton")!.style.backgroundColor = "#dddddd";
    
    setAuthorAdderText('Adding Author...');
  }

  const resetAuthor = () => {
    setName('');
    setEmail('');
    setCollege('');
    setAuthorName('');
    setAuthorEmail('');
    setAuthorCollege('');
    setAuthorClick(0);
  }

  const editAuthor = () => {
    setAuthorName(name);
    setAuthorEmail(email);
    setAuthorCollege(college);
    addAuthor();

    setAuthorAdderText('Editing Author...');
  }

  const cancelAuthor = () => {
    authorLister({ names: name, emails: email, colleges: college }, authorClick);
    resetAuthor();
  }

  const removeAuthor = (i: number) => {
    setAuthors(authors.filter((author, idx) => idx != i));
    document.getElementById("TitleInputTextField")!.style.display = "none";
    document.getElementById("AuthorInputTextField")!.style.display = "none";
    document.getElementById("ContentInputTextField")!.style.display = "none";
  }

  const authorBufferClickers = (author: authorInformation, i: number) => {
    setName(author.names);
    setEmail(author.emails);
    setCollege(author.colleges);
    setAuthorName(author.names);
    setAuthorEmail(author.emails);
    setAuthorCollege(author.colleges);
    handleClickOpenAuthor();
    removeAuthor(i);
    setAuthorClick(i);
  }

  const [openAuthor, setOpenAuthor] = useState(false);
  const handleClickOpenAuthor = () => {
    setOpenAuthor(true);
  };

  const handleCloseEditAuthor = () => {
    editAuthor();
    setOpenAuthor(false);
  };

  const handleCloseRemoveAuthor = () => {
    resetAuthor();
    setOpenAuthor(false);
  };

  const handleCloseCancelAuthor = () => {
    cancelAuthor();
    setOpenAuthor(false);
  };

  const handleSubmitAuthor = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setName(authorName);
    setEmail(authorEmail);
    setCollege(authorCollege);
    if (name && email && college) {
      authorLister({ names: name, emails: email, colleges: college }, authorClick);
      resetAuthor();

      document.getElementById("AuthorInputTextField")!.style.display = "none";

      document.getElementById("TitleBar")!.style.pointerEvents = "all";
      document.getElementById("AuthorContainer")!.style.pointerEvents = "all";
      document.getElementById("ContentContainer")!.style.pointerEvents = "all";
      document.getElementById("ModeSetter")!.style.pointerEvents = "all";

      document.getElementById("PreviewButton")!.style.backgroundColor = '#a84593';

      var access = document.getElementById("AuthorContainer");
      window.scrollTo({
        top: access?.scrollTop,
        behavior: 'smooth'
      });

      setAuthorAdderText('Add Author');
    }
  }


  // Content Elements
  const [header, setHeader] = useState('');
  const [info, setInfo] = useState('');

  const [contentHeader, setContentHeader] = useState('');
  const [contentInfo, setContentInfo] = useState('');

  var [contentClick, setContentClick] = useState(0);
  const [contentAdderText, setContentAdderText] = useState('Add Content');

  const [contents, setContents] = useState<contentInformation[]>([]); //Contents are stored in reverse order in list
  const contentLister = (content: contentInformation, i: number = contentClick) => {
    contents.splice(i, 0, content);
    setContents(contents);
  }

  const addContent = () => {
    document.getElementById("TitleInputTextField")!.style.display = "none";
    document.getElementById("AuthorInputTextField")!.style.display = "none";
    document.getElementById("ContentInputTextField")!.style.display = "block";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    document.getElementById("TitleBar")!.style.pointerEvents = "none";
    document.getElementById("AuthorContainer")!.style.pointerEvents = "none";
    document.getElementById("ContentContainer")!.style.pointerEvents = "none";
    document.getElementById("ModeSetter")!.style.pointerEvents = "none";

    document.getElementById("PreviewButton")!.style.backgroundColor = "#dddddd"; 

    setContentAdderText('...Adding Content');
  }

  const resetContent = () => {
    setHeader('');
    setInfo('');
    setContentHeader('');
    setContentInfo('');
    setContentClick(0);
  }

  const editContent = () => {
    setContentHeader(header);
    setContentInfo(info);
    addContent();

    setContentAdderText('...Editing Content');
  }

  const cancelContent = () => {
    contentLister({ headers: header, infos: info });
    resetContent();
  }

  const removeContent = (i: number) => {
    setContents(contents.filter((content, idx) => idx != i));
  }

  const contentBufferClickers = (content: contentInformation, i: number = contentClick) => {
    setHeader(content.headers);
    setInfo(content.infos);
    setContentHeader(content.headers);
    setContentInfo(content.infos);
    handleClickOpenContent();
    removeContent(i);
    setContentClick(i);
  }

  const [openContent, setOpenContent] = useState(false);
  const handleClickOpenContent = () => {
    setOpenContent(true);
  };

  const handleCloseEditContent = () => {
    editContent();
    setOpenContent(false);
  };

  const handleCloseRemoveContent = () => {
    resetContent();
    setOpenContent(false);
  };

  const handleCloseCancelContent = () => {
    cancelContent();
    setOpenContent(false);
  };

  const handleSubmitContent = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setHeader(contentHeader);
    setInfo(contentInfo);
    if (header && info) {
      contentLister({ headers: header, infos: info });
      resetContent();

      document.getElementById("ContentInputTextField")!.style.display = "none";

      document.getElementById("TitleBar")!.style.pointerEvents = "all";
      document.getElementById("AuthorContainer")!.style.pointerEvents = "all";
      document.getElementById("ContentContainer")!.style.pointerEvents = "all";
      document.getElementById("ModeSetter")!.style.pointerEvents = "all";

      document.getElementById("PreviewButton")!.style.backgroundColor = '#a84593';

      var access = document.getElementById("ContentContainer");
      window.scrollTo({
        top: access?.scrollTop,
        behavior: 'smooth'
      });

      setContentAdderText('Add Content');
    }
  }



  return (
    <>
      <div className={edits.relativeFixed} title={(displayType) ? "Script Display" : "Block Display"} id = "ModeSetter">
        <Switch checked={displayType} onChange={handleBadgeVisibility} title="Change Display Type" style={{ margin: "auto" }} 
        id = "SwitchSetter"/>
          <Button
            type='submit'
            variant='contained'
            color='secondary'
            title="Enter Preview"
            style={{ margin: "auto", marginBottom: '1px' }}
            id = "PreviewButton"
            onClick = {() => {previewMode()}}
          >Preview</Button>
      </div>

      <div className={edits.paperEdit} id="EditPaper">

        <div className={edits.titlebarContainerEdit} id="TitleBar" onClick={addTitlebar}>
          <div className={edits.titleEdit} id="TitleName" title="Edit Title">
            <i>{titlebar.titlenames}</i>
          </div>
          <div className={edits.subtitleEdit} id="SubTitle" title="Edit Sub-Title">
            <i>{titlebar.subtitles}</i>
          </div>
        </div>

        <div className={edits.authorContainerEdit} id="AuthorContainer">
          {(authors.length < 3) &&
            (<div className={edits.authorEdit} id="AddAuthor" title="Add Author" onClick={addAuthor}>
              <i>{authorAdderText}</i>
            </div>)}

          {authors.map((author, idx) => (
            <div className={edits.authorEdit} key={idx.toString()} id={idx + "a"} title="Edit Author"
              onClick={() => { authorBufferClickers(author, idx) }}
            >
              <p>{author.names}</p>
              <p>{author.emails}</p>
              <p>{author.colleges}</p>
            </div>
          ))}
        </div>

        <div className={edits.contentContainerEdit} id="ContentContainer">
          <div className={edits.contentBoxEdit} id="ContentBoxAdd" title="Add Content" onClick={addContent}>
            <div className={edits.contentHeaderEdit} id="ContentHeaderAdd" title="Add Content Header">
              <i>{contentAdderText + " Header"}</i>
            </div>
            <div className={edits.contentBodyEdit} id="ContentBodyAdd" title="Add Content Body">
              <i>{contentAdderText + " Body"}</i>
            </div>
          </div>

          {contents.map((content, idx) => (
            <div className={edits.contentBoxEdit} key={idx.toString()} id={idx + "c"} title="Edit Content"
              onClick={() => { contentBufferClickers(content, idx) }}
            >
              <div className={edits.contentHeaderEdit} id={idx + "ch"}>{content.headers}</div>
              <div className={edits.contentBodyEdit} id={idx + "cb"} dangerouslySetInnerHTML={{ __html: mdParser.render(content.infos) }}>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div id="InputTextField">

        <div className={edits.formTextField} id="TitleInputTextField">
          <form onSubmit={handleSubmitTitle} className={edits.inputContainerEdit}>
            <TextField
              fullWidth
              variant='outlined'
              id='InputField'
              label='Header'
              style={{ backgroundColor: '#dfe9f0' }}
              onChange={(e) => { setTitlename(e.target.value) }}
              className={edits.inputTextEdit}
            /> <br />
            <TextField
              fullWidth
              variant='outlined'
              id='InputField'
              label='Sub-Title'
              style={{ backgroundColor: '#dfe9f0' }}
              onChange={(e) => { setSubtitle(e.target.value) }}
              className={edits.inputTextEdit}
            /> <br />
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              className={edits.inputTextEdit}
            >Submit</Button>
          </form>
        </div>

        <div className={edits.formTextField} id="AuthorInputTextField">
          <form onSubmit={handleSubmitAuthor} className={edits.inputContainerEdit}>
            <TextField
              fullWidth
              variant='outlined'
              id='InputField'
              label='Name'
              style={{ backgroundColor: '#dfe9f0' }}
              value={authorName}
              onChange={(e) => { setAuthorName(e.target.value); }}
              className={edits.inputTextEdit}
            /> <br />
            <TextField
              fullWidth
              variant='outlined'
              id='InputField'
              label='Email'
              style={{ backgroundColor: '#dfe9f0' }}
              value={authorEmail}
              onChange={(e) => { setAuthorEmail(e.target.value); }}
              className={edits.inputTextEdit}
            /> <br />
            <TextField
              fullWidth
              variant='outlined'
              id='InputField'
              label='College'
              style={{ backgroundColor: '#dfe9f0' }}
              value={authorCollege}
              onChange={(e) => { setAuthorCollege(e.target.value); }}
              className={edits.inputTextEdit}
            /> <br />
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              className={edits.inputTextEdit}
            >Submit</Button>
          </form>
        </div>

        <div className={edits.formTextField} id="ContentInputTextField">
          <form onSubmit={handleSubmitContent} className={edits.inputContainerEdit}>
            <TextField
              fullWidth
              variant='outlined'
              id='InputField'
              label='Content Header'
              style={{ backgroundColor: '#dfe9f0' }}
              value={contentHeader}
              onChange={(e) => { setContentHeader(e.target.value); }}
              className={edits.inputTextEdit}
            /> <br />
            <Editor
              renderHTML={text => mdParser.render(text)}
              plugins={plugins}
              config='commonmark'
              id='InputField'
              style={{ backgroundColor: '#dfe9f0' }}
              value={contentInfo}
              onChange={(e) => { setContentInfo(e.text.toString()); }}
              className={edits.inputTextEdit}
            /> <br />
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              className={edits.inputTextEdit}
            >Submit</Button>
          </form>
        </div>

      </div>

      <div>
        <Dialog
          open={openAuthor}
          onClose={handleCloseCancelAuthor}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Choose"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to remove the Author or proceed to edit?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => { handleCloseEditAuthor() }}>
              Edit
            </Button>
            <Button onClick={() => { handleCloseRemoveAuthor() }} autoFocus>
              Remove
            </Button>
            <Button onClick={() => { handleCloseCancelAuthor() }} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={openContent}
          onClose={handleCloseCancelContent}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Choose"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to remove the Content or proceed to edit?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => { handleCloseEditContent() }}>
              Edit
            </Button>
            <Button onClick={() => { handleCloseRemoveContent() }} autoFocus>
              Remove
            </Button>
            <Button onClick={() => { handleCloseCancelContent() }} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    </>
  )
}
