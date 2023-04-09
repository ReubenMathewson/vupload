import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import pdf from '@/styles/Pdf.module.css'

import Button from '@mui/material/Button';
import jsPDF from 'jspdf';

import * as React from 'react';
import { useState,useEffect,useRef } from 'react';
import useLocalStorage from "use-local-storage";
import { titleInformation, authorInformation, contentInformation } from './finalUI'
import { useSetState } from '@mantine/hooks'

function Preview(){
    const header: string = "Header goes here";
    const footer: string = "Footer goes here";
    //Data
    const [titlebar, setTitlebar] = useLocalStorage<titleInformation>('titlebar',{ title: '' });    
    const [authors, setAuthors] = useLocalStorage<authorInformation[]>('authorStorage',[]);
    const [contents, setContents] = useLocalStorage<contentInformation[]>('contentStorage',[]);

    const [contentWarehouse,setContentWarehouse] = useLocalStorage<string[]>('contentManager',[]);
    const [contentUsage,setContentUsage] = useLocalStorage<string>("contentDelivery","");

    var index: number = 425;
    var increment0: number = 1200;
    var increment1: number = 900;
    var increment2: number = 650;
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
                index += (text.length - 7);
                buffer += (text.substring(0,text.length - 7));
                // console.log("test0" + buffer);
            } else if((test1 == "\u003Cp\u003E\u003Cbr")){
                index += (text.length - 6);
                buffer += (text.substring(0,text.length - 6));
                // console.log("test1" + buffer);
            }  else if((test2 == "\u003Cp\u003E\u003Cb")) {
                index += (text.length - 5);
                buffer += (text.substring(0,text.length - 5));
                // console.log("test2" + buffer);
            } else if((test3 == "\u003Cimg") || (test3 == "\u003Cp\u003E\u003C")) {
                index += (text.length - 4);
                buffer += (text.substring(0,text.length - 4));
                // console.log("test3" + buffer);
            } else if ((test4 == "\u003Cim") || (test4 == "\u003Cp\u003E") || (test4 == "\u003Cbr")) {
                index += (text.length - 3);
                buffer += (text.substring(0,text.length - 3));
                // console.log("test4" + buffer);
            } else if ((test5 == "\u003Ci") || (test5 == "\u003Cp") || (test5 == "\u003Cb")) {
                index += (text.length - 2);
                buffer += (text.substring(0,text.length - 2));
                // console.log("test5" + buffer);
            } else if(test6 == "\u003C"){
                index += (text.length - 1);
                buffer += (text.substring(0,text.length - 1));
                // console.log("test6" + buffer);
            } else {
                var im = /<img.*/g;
                var imgIndex = text.lastIndexOf("\u003Cimg");
                var clsIndex = text.lastIndexOf("\u003E");
                if(text.match(im)){
                    if(clsIndex){
                        if(imgIndex < clsIndex){
                            index += (text.length);
                            buffer += (text.substring(0));
                            // console.log("test7" + buffer);
                        }
                    }
                    // console.log("test-");
                }
                index += (text.length - (imgIndex + 1));
                buffer += (text.substring(0,text.length - (imgIndex + 1)));
                // console.log("test8" + buffer);
            } 
        }
    }

    const loadData = (num: number) => {
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
            console.log("testI-3");

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
                    }
                    else if(counter == 1){
                        text = text.substring(0, increment1);
                    } else{
                        text = text.substring(0, increment0);
                    }

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
                            index += (text.length - 7);
                            buffer += (text.substring(0,text.length - 7));
                            // console.log("test0" + buffer);
                        } else if((test1 == "\u003Cp\u003E\u003Cbr")){
                            index += (text.length - 6);
                            buffer += (text.substring(0,text.length - 6));
                            // console.log("test1" + buffer);
                        }  else if((test2 == "\u003Cp\u003E\u003Cb")) {
                            index += (text.length - 5);
                            buffer += (text.substring(0,text.length - 5));
                            // console.log("test2" + buffer);
                        } else if((test3 == "\u003Cimg") || (test3 == "\u003Cp\u003E\u003C")) {
                            index += (text.length - 4);
                            buffer += (text.substring(0,text.length - 4));
                            // console.log("test3" + buffer);
                        } else if ((test4 == "\u003Cim") || (test4 == "\u003Cp\u003E") || (test4 == "\u003Cbr")) {
                            index += (text.length - 3);
                            buffer += (text.substring(0,text.length - 3));
                            // console.log("test4" + buffer);
                        } else if ((test5 == "\u003Ci") || (test5 == "\u003Cp") || (test5 == "\u003Cb")) {
                            index += (text.length - 2);
                            buffer += (text.substring(0,text.length - 2));
                            // console.log("test5" + buffer);
                        } else if(test6 == "\u003C"){
                            index += (text.length - 1);
                            buffer += (text.substring(0,text.length - 1));
                            // console.log("test6" + buffer);
                        } else {
                            var im = /<img.*/g;
                            var imgIndex = text.lastIndexOf("\u003Cimg");
                            var clsIndex = text.lastIndexOf("\u003E");
                            if(text.match(im)){
                                if(clsIndex){
                                    if(imgIndex < clsIndex){
                                        index += (text.length);
                                        buffer += (text.substring(0));
                                        // console.log("test7" + buffer);
                                    }
                                }
                                index += (text.length - (imgIndex + 1));
                                buffer += (text.substring(0,text.length - (imgIndex + 1)));
                                // console.log("test-");
                            } else{
                                index += (text.length);
                                buffer += (text.substring(0));
                            }
                            // console.log("test8" + buffer);
                        }
                    }
                }
            } else {
                if(counter == 2){
                    text = text.substring(0, increment2);
                }
                else if(counter == 1){
                    text = text.substring(0, increment1);
                } else{
                    text = text.substring(0, increment0);
                }

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
                        index += (text.length - 7);
                        buffer += (text.substring(0,text.length - 7));
                        // console.log("test0" + buffer);
                    } else if((test1 == "\u003Cp\u003E\u003Cbr")){
                        index += (text.length - 6);
                        buffer += (text.substring(0,text.length - 6));
                        // console.log("test1" + buffer);
                    }  else if((test2 == "\u003Cp\u003E\u003Cb")) {
                        index += (text.length - 5);
                        buffer += (text.substring(0,text.length - 5));
                        // console.log("test2" + buffer);
                    } else if((test3 == "\u003Cimg") || (test3 == "\u003Cp\u003E\u003C")) {
                        index += (text.length - 4);
                        buffer += (text.substring(0,text.length - 4));
                        // console.log("test3" + buffer);
                    } else if ((test4 == "\u003Cim") || (test4 == "\u003Cp\u003E") || (test4 == "\u003Cbr")) {
                        index += (text.length - 3);
                        buffer += (text.substring(0,text.length - 3));
                        // console.log("test4" + buffer);
                    } else if ((test5 == "\u003Ci") || (test5 == "\u003Cp") || (test5 == "\u003Cb")) {
                        index += (text.length - 2);
                        buffer += (text.substring(0,text.length - 2));
                        // console.log("test5" + buffer);
                    } else if(test6 == "\u003C"){
                        index += (text.length - 1);
                        buffer += (text.substring(0,text.length - 1));
                        // console.log("test6" + buffer);
                    } else {
                        var im = /<img.*/g;
                        var imgIndex = text.lastIndexOf("\u003Cimg");
                        var clsIndex = text.lastIndexOf("\u003E");
                        if(text.match(im)){
                            if(clsIndex){
                                if(imgIndex < clsIndex){
                                    index += (text.length);
                                    buffer += (text.substring(0));
                                    // console.log("test7" + buffer);
                                }
                            }
                            index += (text.length - (imgIndex + 1));
                            buffer += (text.substring(0,text.length - (imgIndex + 1)));
                            // console.log("test-");
                        } else{
                            index += (text.length);
                            buffer += (text.substring(0));
                        }
                        // console.log("test8" + buffer);
                    }
                }
            }
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
        
        while(index < contentUsage.length - 1){
            console.log(index)
            callData()
            arrNode.push(buffer)
            console.log(index)
        } 
        
    }

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

            <div style = {{marginLeft: "calc(50% - 21cm/2)"}}>
                <div ref = { templatePageRef }>
                    {callFirstPage(index)}
                    {callPageData()}
                    {
                        arrNode.map((divisions: any,idx: any) => (

                            <div className = {pdf.page} key = {idx.toString()}>

                                <div id = "header" style = {{position: "absolute", left: "43%"}} >
                                    { header }
                                </div>
                            
                                <div className = {pdf.contentData} id = { 'DisplayContent'}>

                                    <p className = {pdf.matter} id = 'ContentHeading'
                                        dangerouslySetInnerHTML = {{ __html: divisions}}></p>

                                </div>

                                <div style = {{position: "absolute", bottom: "0.25cm", left: "38%"}} id = "footer">
                                    
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