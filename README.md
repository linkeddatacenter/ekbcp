Welcome to EKBCP 
==============================

EKBCP project provides an interactive control panel for [LinkedData.Center services] (http://LinkedData.Center/) and was initially developed in Esino Lario 
during [wikimedia 2016](https://wikimania2016.wikimedia.org/wiki/Main_Page)  in LinkedData.Center Campus in Esino Lario (Italy). 

EKBCP uses [YASGUI](http://doc.yasgui.org/) and [3Dsparql](http://biohackathon.org/d3sparql/) libraries integrated with the [EKB APIs] (http://LinkedData.Center/api) provided by
 [LinkedData.Center](http://LinkedData.Center/)

Have a look to our EKBCP service running at [http://linkeddatacenter.github.io/ekbcp/web](http://linkeddatacenter.github.io/ekbcp/web)


The project is still ongoing..

## How to use/modify
You need LinkedData.Center credential to access a knowledge base ( endpoint, usename and password). Y

 1. clone locally the project and publish web directory in a web server (you can use some feature just opening the file directly from browser) 
 2. set your LinkedData.Center credentials in the upper right menu and enjoy the web
    interface. You can use demo read only credentials (https://hub1.linkeddata.center/demo, demo, demo) or [appy for a free tier subcription](http://linkeddata.center/home/pricing#cta).

	
This project use aggeressively all cache leves (browser, http , CDN, applicative, graph db, etc), 
if you make modification to sources plesase remember to clean all cached info before testing your modifications.

## Authors
Thomas Abbondi, Enrico Biella, Leonardo Longhi, Tommaso Redaelli, Prof. Raffaele Milani, Prof. Gennaro Malafronte from  [Istituto di Istruzione Secondaria Superiore 'Alessandro Greppi'](http://www.issgreppi.gov.it/)

## License
EKBCP is Copyright by LinkedData.Center and is freely available with MIT license.

