# Decrypt the secret
mkdir $HOME/tempSecrets
# decode base64 secret string
echo $SECRET_STRING | base64 --decode | tee $HOME/tempSecrets/secret.gpg >/dev/null
gpg --quiet --batch --yes --decrypt --passphrase="$PG_PASSPHRASE" \
--output $DESTINATION $HOME/tempSecrets/secret.gpg

