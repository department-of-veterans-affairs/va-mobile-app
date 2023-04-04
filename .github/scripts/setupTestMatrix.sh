#
# Splits up unit tests into $2 number of chunks and runs yarn test on $1 of $2 set of chunks
# Adapted from https://avraam.dev/articles/2020-11-20-parallelize-tests-on-github-actions/
#

echo "Config: Current Chunk $1, Number of chunks: $2"

# Calculate how many test files should each chunk have using jest --listTests
CHUNK_SIZE=$((`./node_modules/.bin/jest --listTests | wc -l` / $2))

echo "Chunk size: $CHUNK_SIZE"

# Get the list of the tests that will run 
TEST_START_INDEX=$( expr "$CHUNK_SIZE" '*' "$1")
TEST_FILES=$(./node_modules/.bin/jest --listTests | head -n $TEST_START_INDEX | tail -n $CHUNK_SIZE)

echo "======= TEST FILES ======="
echo $TEST_FILES

# Run each chunk.  --maxWorkers=2 is optimized to use max # of GitHub Actions workers cores
yarn test $TEST_FILES --maxWorkers=2
