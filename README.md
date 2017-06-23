
# osm-node-mongodb

Parse OSM files and insert in MongoDb.It uses sax-js for parsing osm files. The processing is done using sax-stream and node streams and are inserted into mongodb using bulk-insert.
Note: A minor change has been done in sax-stream to grep multiple nodes.


### Installing

Clone Repository

```
git clone https://github.com/anand870/osm-node-mongodb.git
```
Install node modules

```
npm install
```
Run
```
node index.js
```
### How It works

The program currently opens three connections for mongodb at once for node,way and relation collections. It uses bulk insert to insert documents depending on batchSize.



### Sample Input
```
<?xml version="1.0" encoding="UTF-8"?>
<osm>
  <node changeset="10373979" id="25038483" lat="-22.9809491" lon="-43.2068586" timestamp="2012-01-12T21:51:07Z" uid="12293" user="Nighto" version="2">
		<tag k="source" v="Yahoo imaery" />
	</node>
	<way changeset="42433432" id="444337539" timestamp="2016-09-25T22:22:39Z" uid="502691" user="ThiagoPv" version="1">
		<nd ref="2841027216" />
		<nd ref="2841027616" />
		<tag k="highway" v="secondary" />
		<tag k="lanes" v="2" />
		<tag k="lit" v="yes" />
		<tag k="name" v="Estrada do Pontal" />
		<tag k="oneway" v="yes" />
		<tag k="surface" v="asphalt" />
	</way>
	<relation changeset="34922564" id="121687" timestamp="2015-10-28T10:01:06Z" uid="502691" user="ThiagoPv" version="6">
		<member ref="30775792" role="outer" type="way" />
		<member ref="33747005" role="inner" type="way" />
		<member ref="33747063" role="inner" type="way" />
		<member ref="33747066" role="inner" type="way" />
		<member ref="33747078" role="inner" type="way" />
		<tag k="name" v="Pavilhão Reitor João Lyra Filho" />
		<tag k="type" v="multipolygon" />
		<tag k="building" v="university" />
	</relation>


</osm>

```
### Sample Output
```
{
	"_id" : ObjectId("594d075395aae72c8add90c0"),
	"changeset" : "10373979",
	"id" : "25038483",
	"lat" : "-22.9809491",
	"timestamp" : "2012-01-12T21:51:07Z",
	"uid" : "12293",
	"user" : "Nighto",
	"version" : "2",
	"nodetype" : "node",
	"loc" : {
		"type" : "Point",
		"coordinates" : [
			-43.2068586,
			-22.9809491
		]
	},
	"lng" : "-43.2068586",
	"tags" : {
		
	}
}

{
	"_id" : ObjectId("594d075395aae72c8add90c1"),
	"changeset" : "42433432",
	"id" : "444337539",
	"timestamp" : "2016-09-25T22:22:39Z",
	"uid" : "502691",
	"user" : "ThiagoPv",
	"version" : "1",
	"nodetype" : "way",
	"tags" : {
		
	},
	"name" : "Estrada do Pontal",
	"nd" : [
		{
			"ref" : "2841027216",
			"nodetype" : "nd"
		},
		{
			"ref" : "2841027616",
			"nodetype" : "nd"
		}
	]
}

{
	"_id" : ObjectId("594d075395aae72c8add90c2"),
	"changeset" : "34922564",
	"id" : "121687",
	"timestamp" : "2015-10-28T10:01:06Z",
	"uid" : "502691",
	"user" : "ThiagoPv",
	"version" : "6",
	"nodetype" : "relation",
	"tags" : {
		
	},
	"name" : "Pavilhão Reitor João Lyra Filho",
	"member" : [
		{
			"ref" : "30775792",
			"role" : "outer",
			"type" : "way",
			"nodetype" : "member"
		},
		{
			"ref" : "33747005",
			"role" : "inner",
			"type" : "way",
			"nodetype" : "member"
		},
		{
			"ref" : "33747063",
			"role" : "inner",
			"type" : "way",
			"nodetype" : "member"
		},
		{
			"ref" : "33747066",
			"role" : "inner",
			"type" : "way",
			"nodetype" : "member"
		},
		{
			"ref" : "33747078",
			"role" : "inner",
			"type" : "way",
			"nodetype" : "member"
		}
	]
}

```


## Built With

* [sax-js](https://github.com/isaacs/sax-js) - Parsing XML Files
* [sax-stream](https://github.com/melitele/sax-stream) - Convert parsed node into streams

