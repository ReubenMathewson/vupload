import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import ui from '@/styles/Ui.module.css'


import * as React from 'react';
import { useState,useEffect } from 'react';
import useLocalStorage from "use-local-storage";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';


import { RichTextEditor, RichTextEditorProps } from '@mantine/rte';
import { image } from '@uiw/react-md-editor'

export function RichText(props: RichTextEditorProps) {
    if (typeof window !== 'undefined') {
      const { RichTextEditor } = require('@mantine/rte');
      return <RichTextEditor {...props} />;
    }
    return null;
  }


//Data Storage
export interface titleInformation {
    title: string,
}

export interface authorInformation {
    name: string,
    institution: string,
    email: string,
}

export interface contentInformation {
    header: string,
    matter: string,
}

//Properties
interface displayRecord {
    titleForm: boolean;
    authorForm: boolean;
    contentForm: boolean;
}

function UI(){

    //Functionality
    const [titleForm,setTitleForm] = useState(false);
    const [authorForm,setAuthorForm] = useState(false);
    const [contentForm,setContentForm] = useState(false);

    const [recorder,setRecorder] = useState<displayRecord>({titleForm:false,authorForm:false,contentForm:false});

    const [authorClick,setAuthorClick] = useState(0);
    const [contentClick,setContentClick] = useState(0);

    useEffect(() => {
        setRecorder({
            titleForm: titleForm,
            authorForm: authorForm,
            contentForm: contentForm,
        })
    }, [titleForm,authorForm,contentForm]);
    
    //Title
    const [title, setTitle] = useState('Enter Research Title');

    const [titleBuffer, setTitleBuffer] = useState('');

    useEffect(() => {
        setTitle(titleBuffer);
    }, [titleBuffer]);

    const [titlebar, setTitlebar] = useLocalStorage<titleInformation>('titlebar',{ title: title });
    const titleLister = (titlehead: titleInformation) => {
        setTitlebar(titlehead);
    };

    const resetTitle = () => {
        setTitle('Enter Research Title')
        setTitleBuffer('Enter Research Title');
    };

    const addTitle = () => {
        document.getElementById("Container")!.style.pointerEvents = 'none';
        if(document.getElementById("AddAuthor") != undefined) {document.getElementById("AddAuthor")!.style.display = 'none';}
        document.getElementById("AddContent")!.style.display = 'none';
        setTitleForm(true);
        setAuthorForm(false);
        setContentForm(false);
        window.scrollTo({ 
            top: document.body.scrollHeight, 
            behavior: 'smooth' 
        });
    };

    const submitTitle = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setTitle(titleBuffer)

        if(title){
            titleLister({title: title});
            setTitleForm(false);
            var access = document.getElementById('Title');
            window.scrollTo({
                top: access?.scrollTop,
                behavior: 'smooth'
            })
            document.getElementById("Container")!.style.pointerEvents = 'all';
            if(document.getElementById("AddAuthor") != undefined) {document.getElementById("AddAuthor")!.style.display = 'block';}
            document.getElementById("AddContent")!.style.display = 'block';
        }
    };
    
    //Author
    const [name,setName] = useState('');    
    const [institution,setInstitution] = useState('');
    const [email,setEmail] = useState('');

    const [nameBuffer,setNameBuffer] = useState('');    
    const [institutionBuffer,setInstitutionBuffer] = useState('');
    const [emailBuffer,setEmailBuffer] = useState('');

    useEffect(() => {
        setName(nameBuffer);
        setInstitution(institutionBuffer);
        setEmail(emailBuffer);
    }, [nameBuffer,institutionBuffer,emailBuffer]);

    const [authors, setAuthors] = useLocalStorage<authorInformation[]>('authorStorage',[]);
    const authorLister = (author: authorInformation, i: number = authorClick) => {
        authors.splice(i, 0, author);
        setAuthors([...authors]);
    };

    const resetAuthor = () => {
        setName('');
        setInstitution('')
        setEmail('');
        setNameBuffer('');
        setInstitutionBuffer('');
        setEmailBuffer('');
        setAuthorClick(0);
    };

    const addAuthor = () => {
        document.getElementById("Container")!.style.pointerEvents = 'none';
        if(document.getElementById("AddAuthor") != undefined) {document.getElementById("AddAuthor")!.innerHTML = 'Adding Author';}
        document.getElementById("AddContent")!.style.display = 'none';
        setTitleForm(false);
        setAuthorForm(true);
        setContentForm(false);
        window.scrollTo({ 
            top: document.body.scrollHeight, 
            behavior: 'smooth' 
        });
    };

    const authorBuffer = (author: authorInformation, i: number) => {
        setName(author.name);
        setInstitution(author.institution);
        setEmail(author.email);
        setNameBuffer(author.name);
        setInstitutionBuffer(author.institution);
        setEmailBuffer(author.email);
        handleOpenAuthor();
        setAuthorClick(i);
    };

    const [openAuthor, setOpenAuthor] = useState(false);
    const handleOpenAuthor = () => {
        setOpenAuthor(true);
    };

    const editAuthor = () => {
        setAuthors(authors.filter((author, idx) => idx != authorClick));
        setNameBuffer(name);
        setInstitutionBuffer(institution);
        setEmailBuffer(email);
        addAuthor();
        if(document.getElementById("AddAuthor") != undefined) {document.getElementById("AddAuthor")!.innerHTML = 'Editing Author';}
    };
    
    const cancelAuthor = () => {
        resetAuthor();
    };

    const handleEditAuthor = () => {
        editAuthor();
        setOpenAuthor(false);
    };
    
    const handleRemoveAuthor = () => {
        setAuthors(authors.filter((author, idx) => idx != authorClick));
        resetAuthor();
        setOpenAuthor(false);
    };
    
    const handleCancelAuthor = () => {
        cancelAuthor();
        setOpenAuthor(false);
    };

    const submitAuthor = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setName(nameBuffer);
        setInstitution(institutionBuffer);
        setEmail(emailBuffer);

        if(name && institution && email){
            authorLister({name: name, institution: institution, email: email}, authorClick);
            resetAuthor();
            setAuthorForm(false);
            var access = document.getElementById('Author');
            window.scrollTo({
                top: access?.scrollTop,
                behavior: 'smooth'
            })
            document.getElementById("Container")!.style.pointerEvents = 'all';
            if(document.getElementById("AddAuthor") != undefined) {document.getElementById("AddAuthor")!.innerHTML = 'Add Author';}
            document.getElementById("AddContent")!.style.display = 'block';
        }
    };


    //Content
    const [header,setHeader] = useState('');
    const [matter,setMatter] = useState('');

    const [headerBuffer,setHeaderBuffer] = useState('');
    const [matterBuffer,setMatterBuffer] = useState('');

    useEffect(() => {
        setHeader(headerBuffer);
        setMatter(matterBuffer);
    }, [headerBuffer,matterBuffer]);

    const [contents, setContents] = useLocalStorage<contentInformation[]>('contentStorage',[]);
    const contentLister = (content: contentInformation, i: number = contentClick) => {
        contents.splice(i, 0, content);
        setContents([...contents]);
    };

    const resetContent = () => {
        setHeader('');
        setMatter('')
        setHeaderBuffer('');
        setMatterBuffer('');
        setContentClick(0);
    };

    const addContent = () => {
        document.getElementById("Container")!.style.pointerEvents = 'none';
        if(document.getElementById("AddAuthor") != undefined) {document.getElementById("AddAuthor")!.style.display = 'none';}
        document.getElementById("AddContentHeading")!.innerHTML = 'Adding Content Header...';
        document.getElementById("AddContentMatter")!.innerHTML = 'Adding Content Information...';
        setTitleForm(false);
        setAuthorForm(false);
        setContentForm(true);
        window.scrollTo({ 
            top: document.body.scrollHeight, 
            behavior: 'smooth' 
        });
    };

    const contentBuffer = (content: contentInformation, i: number) => {
        setHeader(content.header);
        setMatter(content.matter);
        setHeaderBuffer(content.header);
        setMatterBuffer(content.matter);
        handleOpenContent();
        setContentClick(i);
    };

    const [openContent, setOpenContent] = useState(false);
    const handleOpenContent = () => {
        setOpenContent(true);
    };

    const editContent = () => {
        setContents(contents.filter((content, idx) => idx != contentClick));
        setHeaderBuffer(header);
        setMatterBuffer(matter);
        addContent();
        if(document.getElementById("AddAuthor") != undefined) {document.getElementById("AddAuthor")!.style.display = 'none';}
        document.getElementById("AddContentHeading")!.innerHTML = 'Editing Content Header...';
        document.getElementById("AddContentMatter")!.innerHTML = 'Editing Content Information...';
    };
    
    const cancelContent = () => {
        resetContent();
    };

    const handleEditContent = () => {
        editContent();
        setOpenContent(false);
    };
    
    const handleRemoveContent = () => {
        setContents(contents.filter((content, idx) => idx != contentClick));
        resetContent();
        setOpenContent(false);
    };
    
    const handleCancelContent = () => {
        cancelContent();
        setOpenContent(false);
    };

    const submitContent = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setHeader(headerBuffer);
        setMatter(matterBuffer);

        if(header && matter){
            contentLister({header: header, matter: matter}, contentClick);
            resetContent();
            setContentForm(false);
            var access = document.getElementById('Content');
            window.scrollTo({
                top: access?.scrollTop,
                behavior: 'smooth'
            })
            document.getElementById("Container")!.style.pointerEvents = 'all';
            if(document.getElementById("AddAuthor") != undefined) {document.getElementById("AddAuthor")!.style.display = 'block';}
            document.getElementById("AddContentHeading")!.innerHTML = 'Add Content Header...';
            document.getElementById("AddContentMatter")!.innerHTML = 'Add Content Information...';
        }
    };

    // Content Delivery
    const [contentWarehouse,setContentWarehouse] = useLocalStorage<string[]>('contentManager',[]);
    const [contentUsage,setContentUsage] = useLocalStorage<string>("contentDelivery","");

    const resetWarehouse = () => {
        setContentWarehouse([]);
        setContentUsage("");
        var buffer: string = "";
        contents.map((content, idx) => (
            contentWarehouse.push(content.matter,content.header)
        ));
        var iterator: number = 0;
        while(iterator < contentWarehouse.length){
            buffer = buffer + contentWarehouse[contentWarehouse.length - (iterator + 1)] + "<br\>";
            iterator = iterator + 1;
        }
        setContentUsage(buffer);
    }

    return (
        <>

            {/* Icons */}
            <div className = {ui.relative} id = 'Options'>
                
            <Button variant = "contained" style = {{backgroundColor: '#0ff5e3', color: '#23243d'}} 
            onClick = {() => {
                resetTitle();
                resetAuthor();
                resetContent();
                setAuthors([]);
                setContents([]);

                document.getElementById('Title')!.innerHTML = 'Enter Research Title';
            }}>
                Clear
            </Button><br/>
            <a href = './redirect' >

                <Button 
                    variant = "contained" 
                    style = {{backgroundColor: '#0ff5e3', color: '#23243d'}}
                    onClick = {() => {resetWarehouse()}}
                >
                    Preview
                </Button>

            </a>

            </div>

            {/* Container */}
            <div className = {ui.container} id = 'Container'>

                <div className = {ui.titlebar} id = 'Titlebar'>

                    <div className = {ui.title} id = 'Title' onClick = {addTitle}>
                        { titlebar.title }
                    </div>

                </div>

                <div className = {ui.author} id = 'Author'>

                    {  
                        (authors.length < 3) &&
                        (<div className = {ui.authorData} id = 'AddAuthor' style = {{paddingTop: 'calc(2em)'}}
                        onClick = {addAuthor}>
                            <i>Add Author</i>
                        </div>)
                    }

                    {
                        authors.map((author, idx) => (
                            <div className = {ui.authorData} key = { idx.toString() } id = { 'DisplayAuthor_' + idx }
                            onClick = {() => {authorBuffer(author, idx)}}
                            >
                                <p>{ author.name }</p>
                                <p>{ author.institution }</p>
                                <p>{ author.email }</p>
                            </div>                            
                        ))
                    }

                </div>

                <div className = {ui.content} id = 'Content'>

                    <div className = {ui.contentData} id = 'AddContent' onClick = {addContent}>

                        <p className = {ui.heading} id = 'AddContentHeading'>
                            <i>Add Content Header</i>
                        </p>

                        <p className = {ui.matter} id = 'AddContentMatter'>
                            <i>Add Content Information</i>
                        </p>

                    </div>

                        {
                            contents.map((content, idx) => (
                                <div className = {ui.contentData} key = { idx.toString() } id = { 'DisplayContent_' + idx }
                                onClick = {() => contentBuffer(content, idx)}
                                >

                                    <p className = {ui.heading} id = 'ContentHeading'>
                                        { content.header }
                                    </p>

                                    <p className = {ui.matter} id = 'ContentMatter' style={{}}
                                    dangerouslySetInnerHTML = {{ __html: content.matter}}
                                    />

                                </div>
                            ))    
                        }       

                </div>

            </div>

            {/* Form */}
            <div id = 'Form'>
                                
                {
                    (titleForm) &&
                    (<form onSubmit = {submitTitle} className = {ui.form} id = 'ContentForm'>
                        <TextField
                            fullWidth 
                            variant='outlined'
                            id='InputField'
                            label='Title'
                            value={ titleBuffer }
                            className={ ui.field }
                            onChange={(e) => { setTitleBuffer(e.target.value); }}
                        /><br/>
                        <Button
                            type='submit'
                            variant='contained'
                            style={{margin: 'auto', width: '10em', backgroundColor: '#0ff5e3', color: '#23243d'}}
                        >Submit</Button>
                    </form>)
                }

                {
                    (authorForm) &&
                    (<form onSubmit = {submitAuthor} className = {ui.form} id = 'AuthorForm'>
                        <TextField
                            fullWidth 
                            variant='outlined'
                            id='InputField'
                            label='Name'
                            value={ nameBuffer }
                            className={ ui.field }
                            onChange={(e) => { setNameBuffer(e.target.value); }}
                        /><br/>
                        <TextField
                            fullWidth
                            variant='outlined'
                            id='InputField'
                            label='Institution'
                            value={ institutionBuffer }
                            className={ ui.field }
                            onChange={(e) => { setInstitutionBuffer(e.target.value); }}
                        /><br/>
                        <TextField
                            fullWidth
                            variant='outlined'
                            id='InputField'
                            label='Email'
                            value={ emailBuffer }
                            className={ ui.field }
                            onChange={(e) => { setEmailBuffer(e.target.value); console.log(emailBuffer)}}
                        /><br/>
                        <Button
                            type='submit'
                            variant='contained'
                            style={{margin: 'auto', width: '10em', backgroundColor: '#0ff5e3', color: '#23243d'}}
                        >Submit</Button>
                    </form>)
                }

                {
                    (contentForm) &&
                    (<form onSubmit = {submitContent} className = {ui.form} id = 'ContentForm'>
                        <TextField
                            fullWidth 
                            variant='outlined'
                            id='InputField'
                            label='Header'
                            value={ headerBuffer }
                            className={ ui.field }
                            onChange={(e) => { setHeaderBuffer(e.target.value); }}
                        /><br/>                        
                        { 
                            RichText({
                                id: "rte", 
                                controls: [
                                    ['italic','link', 'image'],
                                    ['unorderedList', 'orderedList'],
                                    ['sup', 'sub'],
                                    ['alignLeft', 'alignCenter', 'alignRight'],
                                ],
                                className: ui.field,
                                value: matterBuffer,
                                onChange: (e) => { 
                                    let images = document.getElementsByTagName('img');
                                    let i = 0;
                                    while(i < images.length){
                                        images[i].width = 620;
                                        images[i].height = 380;
                                        i = i + 1;
                                    }
                                    setMatterBuffer(e);
                                }
                            }) 
                        }<br/>
                        <Button
                            type='submit'
                            variant='contained'
                            style={{margin: 'auto', width: '10em', backgroundColor: '#0ff5e3', color: '#23243d'}}
                        >Submit</Button>
                    </form>)
                }

            </div>
            
            {/* Confirmation */}
            <div>

                <Dialog
                    open={openAuthor}
                    onClose={handleCancelAuthor}
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

                            <Button autoFocus onClick={() => { handleEditAuthor() }}>
                            Edit
                            </Button>
                            <Button onClick={() => { handleRemoveAuthor() }} autoFocus>
                            Remove
                            </Button>
                            <Button onClick={() => { handleCancelAuthor() }} autoFocus>
                            Cancel
                            </Button>

                        </DialogActions>

                </Dialog>

            </div>

            <div>

                <Dialog
                    open={openContent}
                    onClose={handleCancelContent}
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

                        <Button autoFocus onClick={() => { handleEditContent() }}>
                        Edit
                        </Button>
                        <Button onClick={() => { handleRemoveContent() }} autoFocus>
                        Remove
                        </Button>
                        <Button onClick={() => { handleCancelContent() }} autoFocus>
                        Cancel
                        </Button>

                    </DialogActions>

                </Dialog>

            </div>

        </>
    );
}

export default UI;