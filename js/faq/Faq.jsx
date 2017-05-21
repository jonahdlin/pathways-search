import React from 'react';
import {	Glyphicon } from 'react-bootstrap';
import {FaqEntry} from './component/FaqEntry.jsx';

// Faq
// Prop Dependencies ::
// none
export class Faq extends React.Component {
	render() {
		var hostName = window.location.protocol + "//" + window.location.host + window.location.pathname;
		return (
			<div className="Faq">
				<h4 className="text-center">
					Frequently Asked Questions
				</h4>

				<FaqEntry header="Where can I ask a question or post a comment?">
					Please refer questions or comments to our <a href="https://groups.google.com/forum/#!forum/pathway-commons-help" target="_blank">Pathway Commons help Google group</a>.
				</FaqEntry>
				<FaqEntry header="How does the app get its data?">
					All data is retrieved using the <a href="http://www.pathwaycommons.org/pc2/">Pathway Commons web service API</a>.
				</FaqEntry>
				<FaqEntry header="Does the app return everything that matches my query in Pathway Commons?">
					<p>
						No, the app fetches those items designated as 'pathways'.
					</p>
					<p>
						Pathway Commons stores biological data in a standardized format called <a href="http://biopax.org/" target="_blank">BioPAX</a> that provides rich descriptions of many biological concepts or <a href="http://www.pathwaycommons.org/pc2/#biopax_types" target="_blank">'types'</a> (e.g. 'Gene', 'Complex', 'Pathway'). The search app performs queries specifically for BioPAX objects of type 'pathway'. For more general queries, please see the documentation for the <a href="http://www.pathwaycommons.org/pc2/" target="_blank">Pathway Commons web service API</a>.
					</p>
				</FaqEntry>
				<FaqEntry header="How does search work?">
					<p>
						The search app uses the <a href="http://www.pathwaycommons.org/pc2/">Pathway Commons web service API</a> which provides a powerful and flexible full-text search capability. The underlying format of the instructions passed on to the Pathway Commons web service conforms to the <a href="http://lucene.apache.org/core/3_6_2/queryparsersyntax.html">Lucene query syntax</a>.
					</p>
					<p>
						By default, the app uses a multi-pronged search strategy. It aims to boost the relevance of searches by processing the text entered into the search box and formulating an optimized Lucene query against the Pathway Commons search web service. The Lucene query generated by the strategy consists of four groups:
					</p>
					<ol>
						<li>Match the phrase exactly</li>
						<ul>
							<li>
								In this case, an attempt is made to match the text entered - the phrase - with the <code>name</code> Lucene index field of a pathway. No more, no less. For example, the input <code>cell cycle</code> will match pathways named <code>Cell Cycle</code> or <code>cell Cycle</code> but not <code>cell cycle arrest</code>.
							</li>
						</ul>
						<li>Match the phrase with fuzzy edges</li>
						<ul>
							<li>
								Here, the phrase is matched against a pathway's <code>name</code> Lucene index field, but we allow any preceding or trailing text. For example, the input <code>cell cycle</code> will match pathways named <code>mitotic cell cycle arrest</code> but not <code>Krebs cycle in cell mitochondria</code>.
							</li>
						</ul>
						<li>Match all words</li>
						<ul>
							<li>
								In this case, the phrase is broken into space-separated terms and each is run through a series of tests to determine if it conforms to any external database identifiers recognized by Pathway Commons (i.e. HGNC, CHEBI, UniProt). For all remaining tokens that are not identifiers, Pathway Commons will be instructed to match only within a pathway's <code>name</code> Lucene index field. Those pathways containing all terms are returned. For example, the input <code>cell cycle</code> will match pathways named <code>Krebs cycle in cell mitochondria</code> but not <code>Krebs cycle in mitochondria</code>.
							</li>
						</ul>
						<li>Match any words</li>
					</ol>

				</FaqEntry>
				<FaqEntry header="How do I perform a more specific search?">
					After submitting a query, an 'Filter' icon <Glyphicon
						glyph="filter"
						onClick={() => this.toggleFilterMenu(true)}/> provides access to an options menu to tailor your search. You may filter the results that are returned by data provider and/or restrict pathways containing a certain minimum or maximum number of participants. To remove filtering altogether, simply remove any entries for data sources and participants.
				</FaqEntry>
				<FaqEntry header="What types of identifiers or symbols will the app recognize?">
					The search app accepts a list of gene identifiers as input. The app will recognize names approved by:
					<ul>
						<li>
							<a href="http://www.genenames.org/" target="_blank">HUGO Gene Nomenclature Committee (HGNC)</a>
						</li>
						<li>
							<a href="http://www.uniprot.org/" target="_blank">UniProt</a>
						</li>
						<li>
							<a href="https://www.ebi.ac.uk/chebi/" target="_blank">Chemical Entities of Biological Interest (ChEBI)</a>.
						</li>
					</ul>
				</FaqEntry>
				<FaqEntry header="How many results are returned?">
					By default, the top five search results are returned. Click the 'More Results' link below to display up to a maximum of 100 results.
				</FaqEntry>
				<FaqEntry header="Why can’t I find a pathway that I believe exists in Pathway Commons?">
					A likely cause is that your pathway is being filtered out by the default settings declared in the 'Filter' menu. Try to turn off filtering and see if the expected pathway appears: Clear entries for the maximum and minimum number of pathway participants (default maximum is 100;  default minimum is 3).
				</FaqEntry>
				<FaqEntry header="How do I embed the search box or pathway view in my web page?">
					<p>
						You can easily embed the search box or a specific pathway view on your page using an <a href="https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe" target="_blank">iframe</a>.
					</p>
					<p>
						<strong>Embedding a search box</strong><br/> Use the following URL in an iframe, <code>{hostName + "#/search/embed"}</code>.
					</p>
					<p>
						<strong>Embedding a pathway view</strong><br/> Once you have viewed a pathway in the app, modify the URL to contain the path <code>/#/pathway/embed</code>. For example, if you used the app to view a pathway with the URL:
						<code>{hostName + "#/pathway?uri=http%3A%2F%2Fidentifiers.org%2Freactome%2FR-HSA-157118"}</code>,
						the corresponding embeddable URL would be <code>{hostName + "#/pathway/embed?uri=http%3A%2F%2Fidentifiers.org%2Freactome%2FR-HSA-157118"}</code>.
					</p>
				</FaqEntry>
				<FaqEntry header="Where is the source code for this web app?">
					This web app is an open source project <a href="https://github.com/PathwayCommons/pathways-search">hosted on Github</a> where you can view instructions on how to download, build and run the project on your computer.
				</FaqEntry>
			</div>
		);
	}
}
