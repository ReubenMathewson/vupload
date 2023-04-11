import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import pdf from '@/styles/Pdf.module.css'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import jsPDF from 'jspdf';

import * as React from 'react';
import { useState,useEffect,useRef } from 'react';
import useLocalStorage from "use-local-storage";
import { titleInformation, authorInformation, contentInformation } from './finalUI'
import { useSetState } from '@mantine/hooks'

function Preview(){
    const header: string = "Header goes here";
    const footer: string = "Footer";
    //Data
    const [titlebar, setTitlebar] = useLocalStorage<titleInformation>('titlebar',{ title: '' });    
    const [authors, setAuthors] = useLocalStorage<authorInformation[]>('authorStorage',[]);
    const [contents, setContents] = useLocalStorage<contentInformation[]>('contentStorage',[]);

    const [contentWarehouse,setContentWarehouse] = useLocalStorage<string[]>('contentManager',[]);
    const [contentUsage,setContentUsage] = useLocalStorage<string>("contentDelivery","");

    const [increment0,setIncrement0] = useLocalStorage('i0',2500);
    const [increment1,setIncrement1] = useLocalStorage('i1',2000);
    const [increment2,setIncrement2] = useLocalStorage('i2',1700);

    const [increment0buffer,setIncrement0Buffer] = useState(increment0);
    const [increment1buffer,setIncrement1Buffer] = useState(increment1);
    const [increment2buffer,setIncrement2Buffer] = useState(increment2);

    var index: number = 1610;
    var buffer: string = "";

    var arrNode: any = [];

    const tester = (text: string) => {
        var test0 = text.slice(-7);
        var test1 = text.slice(-6);
        var test2 = text.slice(-5);
        var test3 = text.slice(-4);
        var test4 = text.slice(-3);
        var test5 = text.slice(-2);
        var test6 = text.slice(-1);

        // console.log(test0)
        // console.log(test1)
        // console.log(test2)
        // console.log(test3)
        // console.log(test4)
        // console.log(test5)
        // console.log(test6)

        
        
        if(text) {

            if((test0 == "\u003Cp\u003E\u003Cbr\u003E")) {
                index += (-7);
                buffer += (text.substring(0,text.length - 7));
                // console.log("test0");
            } else if((test1 == "\u003Cp\u003E\u003Cbr")){
                index += (-6);
                buffer += (text.substring(0,text.length - 6));
                // console.log("test1");
            }  else if((test2 == "\u003Cp\u003E\u003Cb")) {
                index += (-5);
                buffer += (text.substring(0,text.length - 5));
                // console.log("test2");
            } else if((test3 == "\u003Cimg") || (test3 == "\u003Cp\u003E\u003C")) {
                index += (-4);
                buffer += (text.substring(0,text.length - 4));
                // console.log("test3");
            } else if ((test4 == "\u003Cim") || (test4 == "\u003Cp\u003E") || (test4 == "\u003Cbr")) {
                index += (-3);
                buffer += (text.substring(0,text.length - 3));
                // console.log("test4");
            }else if ((test5 == "\u003Ci") || (test5 == "\u003Cp") || (test5 == "\u003Cb")) {
                index += (-2);
                buffer += (text.substring(0,text.length - 2));
                // console.log("test5");
            } else if(test6 == "\u003C"){
                index += (-1);
                buffer += (text.substring(0,text.length - 1));
                // console.log("test6");
            } else {
                var boi = /\u003Cstrong\u003E.*/g;
                var bof = /\u003Cstrong\u003E.*\u003C\u002Fstrong\u003E/g;
                var boldIndex = text.lastIndexOf("\u003Cstrong\u003E");
                
                var im = /<img.*/g;
                var imgIndex = text.lastIndexOf("\u003Cimg");
                var clsIndex = text.lastIndexOf("\u003E");
                
                if((text.match(boi)) && (text.match(bof) == null)){
                    console.log("Found it")
                    index += (-(boldIndex + 1));
                    buffer += (text.substring(0,text.length - (boldIndex + 1)));
                } else if(text.match(im)){
                    if(clsIndex){
                        if(imgIndex < clsIndex){
                            index += 0;
                            buffer += (text.substring(0));
                            // console.log("test7");
                        }
                    }
                    // console.log("test-");
                } else{
                    index += (-(imgIndex + 1));
                    buffer += (text.substring(0,text.length - (imgIndex + 1)));
                    // console.log("test8");
                } 
            }
        }
    }

    const loadData = (num: number) => {
        var bufferText = contentUsage.substring(index); 
        var si = bufferText.indexOf(" ");
        var ni = bufferText.indexOf("&nbsp");
        var bi = bufferText.indexOf("\u003Cbr\u003E");
        var addIndex = 0

        if(si || ni || bi){
            if(si && ni && bi){
                addIndex = Math.min(si, ni, bi);
            } else if(si && ni && (bi == null)){
                addIndex = Math.min(si, ni);
            } else if(si && bi && (ni == null)){
                addIndex = Math.min(si, bi);
            } else if(ni && bi && (si == null)){
                addIndex = Math.min(ni, bi);
            } else if(si && (bi == null) && (ni == null)){
                addIndex = si;
            } else if(ni && (bi == null) && (si == null)){
                addIndex = ni;
            } else if(bi && (ni == null) && (si == null)){
                addIndex = bi;
            }
        }

        index += addIndex;
        var text = contentUsage.substring(0, index); 
        tester(text);
        
        return (
            <>
                
                <div className = {pdf.titlebar} id = 'Titlebar'>

                    <div className = {pdf.title} id = 'Title'>
                        { titlebar.title }
                    </div>

                </div>

                <div className = {pdf.author} id = 'Author'>

                    {
                        authors.map((author, idx) => (
                            <div className = {pdf.authorData} key = { idx.toString() } id = { 'DisplayAuthor_' + idx }>
                                <p>{ author.name }</p>
                                <p>{ author.institution }</p>
                                <p>{ author.email }</p>
                            </div>                            
                        ))
                    }

                </div>

                <div className = {pdf.content} id = 'Content'>

                    {    
                        <div className = {pdf.contentData} id = { 'DisplayContent'}>

                            <p className = {pdf.matter} id = 'ContentHeading'
                                dangerouslySetInnerHTML = {{ __html: buffer}}></p>

                        </div>
                    } 

                </div>
            </>
        );
    }

    const callData = () => {
        var bufferText = contentUsage.substring(index); 
        var si = bufferText.indexOf(" ");
        var ni = bufferText.indexOf("&nbsp");
        var bi = bufferText.indexOf("\u003Cbr\u003E");
        var addIndex = 0

        if(si || ni || bi){
            if(si && ni && bi){
                addIndex = Math.min(si, ni, bi);
            } else if(si && ni && (bi == null)){
                addIndex = Math.min(si, ni);
            } else if(si && bi && (ni == null)){
                addIndex = Math.min(si, bi);
            } else if(ni && bi && (si == null)){
                addIndex = Math.min(ni, bi);
            } else if(si && (bi == null) && (ni == null)){
                addIndex = si;
            } else if(ni && (bi == null) && (si == null)){
                addIndex = ni;
            } else if(bi && (ni == null) && (si == null)){
                addIndex = bi;
            }
        }

        index += addIndex;
        var text:string = contentUsage.substring(index);
        buffer = "";
        var counter: number = 0;
        while((text.substring(0,5) == "\u003Cimg") && (counter < 3)){
            var ind = text.indexOf("\u003E");
            buffer += text.substring(0,ind + 1);
            text = text.substring(ind + 1);
            counter += 1;
            index += (ind + 1);
        }

        if(counter == 3){
            // console.log("testI-3");

        } else { 
            var imreg = /<img.*>/g
            if(text.match(imreg)){
                if(text.indexOf("\u003Cimg") < increment0){
                    buffer += text.substring(0,text.indexOf("\u003Cimg") + 1)
                    index += text.indexOf("\u003Cimg") + 1;
                    text = text.substring(text.indexOf("\u003Cimg") + 1);
                    var end = text.indexOf("\u003E");
                    buffer += text.substring(0,end + 1);
                    index += end + 1;
                } else {
                    if(counter == 2){
                        text = text.substring(0, increment2);
                        index += increment2;
                    }
                    else if(counter == 1){
                        text = text.substring(0, increment1);
                        index += increment1;
                    } else{
                        text = text.substring(0, increment0);
                        index += increment0;
                    }
                    if(index >= contentUsage.length){index = contentUsage.length;}
                    tester(text);
                }

            } else {
                if(counter == 2){
                    text = text.substring(0, increment2);
                    index += increment2;
                }
                else if(counter == 1){
                    text = text.substring(0, increment1);
                    index += increment1;
                } else{
                    text = text.substring(0, increment0);
                    index += increment0;
                }
                if(index >= contentUsage.length){index = contentUsage.length;}
                tester(text);
            }
        }
    }

    const callFirstPage = (num: number) => {
        return (

                <div className = {pdf.page}>

                    <div style = {{position: "absolute", left: "43%"}} id = "header">
                        { header }
                    </div>
    
                    {loadData(num)} 
                    
                    <div style = {{position: "absolute", bottom: "0.25cm", left: "38%"}} id = "footer">
                        { footer + " Page No: " + 1}
                    </div>       
                    
                </div> 
        );
            
    }

    const callPageData:any = () => {
        
        while(index < contentUsage.length){
            callData()
            arrNode.push(buffer)
        }
    }

    //Requirement
    const [flag,setFlag] = useState(false);


    const templatePageRef = useRef(null);

	const handleGeneratePdf = () => {
		const doc = new jsPDF({
			orientation: "p",
			format: 'a4',
			unit: 'px',
			hotfixes: ["px_scaling"],
			floatPrecision: "smart",
		});
    
        // // Header
        // doc.setFontSize(20);
        // doc.setTextColor(40);
        // doc.text("Report", 22,10);

        // // Footer
        // var str = "Page ";
        // var pageSize = doc.internal.pageSize;
        // var pageHeight = pageSize.height?pageSize.height: pageSize.getHeight();
        // doc.text(str, 22,pageHeight - 10);
  

		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');

		doc.html(templatePageRef.current ?? '', {
			async callback(doc) {
				await doc.save('document');
			},
			autoPaging: true,
			margin: 0,
		});
	};

    return (        
        <>

            <div className = {pdf.relative}>

                <Button variant = "contained" style = {{backgroundColor: '#0ff5e3', color: '#23243d'}} onClick = { handleGeneratePdf }>
                        Generate
                </Button><br/>

                <a href = './finalUI'>
                    <Button variant = "contained" style = {{backgroundColor: '#0ff5e3', color: '#23243d'}}>
                            Back
                    </Button>
                </a>

            </div>

            <div className = {pdf.label}>

                <form className = {pdf.form} id = 'IncrementForm' onSubmit = { () => {
                        setIncrement0(increment0buffer);
                        setIncrement1(increment1buffer);
                        setIncrement2(increment2buffer);
                    }} 
                >
                        <TextField
                            fullWidth 
                            variant='outlined'
                            id='InputField'
                            label='Header'
                            value={ increment0buffer }
                            style = {{background: "white"}}
                            onChange={(e) => { 
                                if(e.target.value) {
                                    setIncrement0Buffer(parseInt(e.target.value));
                                    setIncrement1Buffer((parseInt(e.target.value) > 500)?(parseInt(e.target.value) - 500):500);
                                    setIncrement2Buffer((parseInt(e.target.value) > 800)?(parseInt(e.target.value) - 800):200);
                                } 
                                else {
                                    setIncrement0Buffer(0);
                                    setIncrement1Buffer(0);
                                    setIncrement2Buffer(0);
                                }
                            }}
                        /><br/>
                        {/* <TextField
                            fullWidth 
                            variant='outlined'
                            id='InputField'
                            label='Header'
                            value={ increment1buffer }
                            style = {{background: "white"}}
                            onChange={(e) => { 
                                if(e.target.value) {setIncrement1Buffer(parseInt(e.target.value));} 
                                else {setIncrement1Buffer(0)}
                            }}
                        /><br/>
                        <TextField
                            fullWidth 
                            variant='outlined'
                            id='InputField'
                            label='Header'
                            value={ increment2buffer }
                            style = {{background: "white"}}
                            onChange={(e) => { 
                                if(e.target.value) {setIncrement2Buffer(parseInt(e.target.value));} 
                                else {setIncrement2Buffer(0)}
                            }}
                        /><br/>*/}
                        <Button
                            type='submit'
                            variant='contained'
                            style={{margin: 'auto', width: '10em', backgroundColor: '#0ff5e3', color: '#23243d'}}
                        >Adjust Height</Button>
                    </form>

            </div>

            <div style = {{marginLeft: "calc(50% - 21cm/2)"}}>
                <div ref = { templatePageRef }>
                    {callFirstPage(index)}
                    {callPageData()}
                    {
                        arrNode.map((divisions: any,idx: any) => (

                            <div className = {pdf.page} key = {idx.toString()}>

                                <div id = "header" style = {{left: "43%"}} >
                                    { header }
                                </div>
                            
                                <div className = {pdf.contentData} id = { 'DisplayContent'} style = {{marginBottom: "0.75cm"}}>

                                    <p className = {pdf.matter} id = 'ContentHeading'
                                        dangerouslySetInnerHTML = {{ __html: divisions}}></p>

                                </div>

                                <div style = {{position: "absolute",bottom: "0.25cm", left: "38%"}} id = "footer">
                                    
                                    { footer + " Page No: " + (idx + 2)}
                                </div>

                            </div> 
                        ))
                    }    
                </div>      
            </div>      

        </>
    );
}

export default Preview;