/*
import { NFTStorage, File } from 'nft.storage';

const client = new NFTStorage({ token: 'API_TOKEN' });

async function main() {
  try {
    const metadata = await client.store({
      name: 'Pinpie',
      description: 'Pin is not delicious beef!',
      image: new File([], 'pinpie.jpg', { type: 'image/jpg' }),
    });
    console.log(metadata.url);
  } catch (error) {
    console.error('Error storing metadata:', error);
  }
}

main().catch(error => console.error('Error in main function:', error));
*/
