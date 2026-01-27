from langchain_community.document_loaders import DocusaurusLoader
import nest_asyncio
from langchain_text_splitters import RecursiveCharacterTextSplitter


# load webpage as a document to be consumed
def loadwebpage(url, cht=[]):
    loader = DocusaurusLoader(url,
                              custom_html_tags=cht)
    # Load the documents (this will scrape all pages linked in the sitemap)
    _docs = loader.load()

    # Print the number of loaded documents and an example of the content
    print(f"Loaded {len(_docs)} documents.")
    if _docs:
        print("\nExample document snippet:")
        print(_docs[0].page_content[:500])  # Print the first 500 characters
        print("\nSource:", _docs[0].metadata['source'])
        return _docs
    return []

# chunks the content from the document
def chunking(_docstochunk):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,  # Max size of each chunk in characters
        chunk_overlap=100,  # Number of characters to overlap between chunks
        length_function=len,  # Function to measure chunk length (defaults to len)
    )

    split_docs = text_splitter.split_documents(docs)

    print(f"Created {len(split_docs)} chunks after splitting.")

    if split_docs:
        print("\nFirst chunk content:")
        print(split_docs[0].page_content[:200] + "...")  # Print first 200 chars
        print(f"\nSource URL: {split_docs[0].metadata['source']}")
    return split_docs


# fixes a bug with asyncio and jupyter environments
nest_asyncio.apply()

docs = loadwebpage("https://department-of-veterans-affairs.github.io/va-mobile-app/", ["#__docusaurus"])

if docs:
    # Chunking
    chunking(docs)
    # Generate embeddings
    # Store in a vector store
    # start prompting?


print("Finished running.")