import React from "react";
import {
  Button,
  IconButton,
  Rating,
  Typography,
} from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/outline";

export function Detail() {
  return (
    <section className="py-16 px-8">
      <div className="mx-auto container grid place-items-center grid-cols-1 md:grid-cols-2">
        <img
          src="https://www.material-tailwind.com/image/product-4.png"
          alt="pink blazer"
          className="h-[36rem]"
        />
        <div className="mb-12"> 
          <Typography className="mb-4" variant="h3">
            Premium Blazer
          </Typography>
          <Typography variant="h5">$1,490</Typography>
          <Typography className="!mt-4 text-base font-normal leading-[27px] text-black">
            As we live, our hearts turn colder. Cause pain is what we go through
            as we become older. We get insulted by others, lose trust for those
            others. We get back stabbed by friends. It becomes harder for us to
            give others a hand. We get our heart broken by people we love, even
            that we give them all we have. Then we lose family over time. What
            else could rust the heart more over time? Blackgold.
          </Typography>
          <div className="my-8 flex items-center gap-2">
            <Rating value={4} className="text-amber-500" />
            <Typography className="!text-sm font-bold text-black">
              4.0/5 (100 reviews)
            </Typography>
          </div>
          <Typography color="blue-gray" variant="h6">
            Color
          </Typography>
          <div className="my-8 mt-3 flex items-center gap-2">
            <div className="h-5 w-5 rounded border border-gray-900 bg-blue-gray-600 "></div>
            <div className="h-5 w-5 rounded border border-blue-gray-100 "></div>
            <div className="h-5 w-5 rounded border border-blue-gray-100 bg-gray-900 "></div>
          </div>
          <div className="mb-4 flex w-full items-center gap-3 md:w-1/2 ">
            <Button color="gray" className="w-52">
              Add to Cart
            </Button>
            <IconButton color="gray" variant="text" className="shrink-0">
              <HeartIcon className="h-6 w-6" />
            </IconButton>
          </div>
        </div>
      </div>

      
      <blockquote className="flex flex-col items-start p-4 mt-16 pl-80"> {/* Se ajusta el margen superior */}
        <p className="max-w-2xl text-sm font-medium text-left text-black md:text-base lg:text-lg">
          "I recently used this website for a purchase and I was extremely
          satisfied with the ease of use and the variety of options available.
          The checkout process was seamless and the delivery was prompt."
        </p>
        <footer className="flex items-center gap-3 mt-4 md:mt-6">
          <img
            className="flex-shrink-0 w-10 h-10 border rounded-full border-black/10"
            src="https://loremflickr.com/g/200/200/girl"
            alt="Jane Doe"
            loading="lazy"
          />
          <a
            href="#"
            target="_blank"
            className="inline-block font-bold tracking-tight text-black"
          >
            <p>Jane Doe</p>
            <p className="font-medium text-black/60">Founder of XYZ</p>
          </a>
        </footer>
      </blockquote>
    </section>
  );
}

export default Detail;