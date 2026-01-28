import type { HydrogenComponent } from "@weaverse/hydrogen";
import * as Heading from "~/components/heading";
import * as Link from "~/components/link";
import * as Paragraph from "~/components/paragraph";
import * as SubHeading from "~/components/subheading";
import * as AllProducts from "~/sections/all-products";
import * as BlogPost from "~/sections/blog-post";
import * as Blogs from "~/sections/blogs";
import * as CollectionFilters from "~/sections/collection-filters";
import * as CollectionList from "~/sections/collection-list";
import * as CollectionListItems from "~/sections/collection-list/collections-items";
import * as ColumnsWithImages from "~/sections/columns-with-images";
import * as ColumnWithImageItem from "~/sections/columns-with-images/column";
import * as ColumnsWithImagesItems from "~/sections/columns-with-images/items";
import * as Countdown from "~/sections/countdown";
import * as CountDownTimer from "~/sections/countdown/timer";
import * as FeaturedCollections from "~/sections/featured-collections";
import * as FeaturedCollectionItems from "~/sections/featured-collections/collection-items";
import * as FeaturedProducts from "~/sections/featured-products";
import * as FeaturedProductItems from "~/sections/featured-products/product-items";
import * as HeroImage from "~/sections/hero-image";
import * as HeroVideo from "~/sections/hero-video";
import * as Hotspots from "~/sections/hotspots";
import * as HotspotsItem from "~/sections/hotspots/item";
import * as ImageGallery from "~/sections/image-gallery";
import * as ImageGalleryItem from "~/sections/image-gallery/image";
import * as ImageGalleryItems from "~/sections/image-gallery/items";
import * as ImageWithText from "~/sections/image-with-text";
import * as ImageWithTextContent from "~/sections/image-with-text/content";
import * as ImageWithTextImage from "~/sections/image-with-text/image";
import * as JudgemeReview from "~/sections/judgeme-reviews";
import * as JudgemeReviewList from "~/sections/judgeme-reviews/review-list";
import * as JudgemeReviewSummary from "~/sections/judgeme-reviews/review-summary";
import * as MainProduct from "~/sections/main-product";
import * as JudgemeStarsRating from "~/sections/main-product/judgeme-stars-rating";
import * as ProductATCButtons from "~/sections/main-product/product-atc-buttons";
import * as ProductBadges from "~/sections/main-product/product-badges";
import * as ProductBreadcrumb from "~/sections/main-product/product-breadcrumb";
import * as ProductBundledVariants from "~/sections/main-product/product-bundled-variants";
import * as ProductCollapsibleDetails from "~/sections/main-product/product-collapsible-details";
import * as ProductPrices from "~/sections/main-product/product-prices";
import * as ProductQuantitySelector from "~/sections/main-product/product-quantity-selector";
import * as ProductSummary from "~/sections/main-product/product-summary";
import * as ProductTitle from "~/sections/main-product/product-title";
import * as ProductVariantSelector from "~/sections/main-product/product-variant-selector";
import * as ProductVendor from "~/sections/main-product/product-vendor";
import * as MapSection from "~/sections/map";
import * as NewsLetter from "~/sections/newsletter";
import * as NewsLetterForm from "~/sections/newsletter/newsletter-form";
import * as OurTeam from "~/sections/our-team";
import * as OurTeamMembers from "~/sections/our-team/team-members";
import * as Page from "~/sections/page";
import * as PromotionGrid from "~/sections/promotion-grid";
import * as PromotionGridButtons from "~/sections/promotion-grid/buttons";
import * as PromotionGridItem from "~/sections/promotion-grid/item";
import * as PromotionButton from "~/sections/promotion-grid/promotion-button";
import * as RelatedArticles from "~/sections/related-articles";
import * as RelatedProducts from "~/sections/related-products";
import * as SingleProduct from "~/sections/single-product";
import * as SlideShow from "~/sections/slideshow";
import * as SlideShowSlide from "~/sections/slideshow/slide";
import * as Spacer from "~/sections/spacer";
import * as Testimonial from "~/sections/testimonials";
import * as TestimonialItem from "~/sections/testimonials/item";
import * as TestimonialItemV2 from "~/sections/testimonials/item-v2";
import * as TestimonialItems from "~/sections/testimonials/items";
import * as VideoEmbed from "~/sections/video-embed";
import * as VideoEmbedItem from "~/sections/video-embed/video";
import * as StockAlert from "~/sections/stock-alert";
import * as PromotionBanner from "~/sections/promotion-banner";
import * as PromotionBannerItem from "~/sections/promotion-banner/item";
import * as FAQ from "~/sections/faq";
import * as FAQItems from "~/sections/faq/items";
import * as FAQItem from "~/sections/faq/item";
import * as FeatureIcons from "~/sections/feature-icons";
import * as FeatureIconsGrid from "~/sections/feature-icons/grid";
import * as FeatureIconsItem from "~/sections/feature-icons/item";
import * as FeatureComparison from "~/sections/feature-comparison";
import * as FeatureComparisonTable from "~/sections/feature-comparison/table";
import * as FeatureComparisonTableItem from "~/sections/feature-comparison/table-item";
import * as ProductSpecifications from "~/sections/product-specifications";
import * as ProductSpecificationsList from "~/sections/product-specifications/list";
import * as ProductSpecificationsItem from "~/sections/product-specifications/item";
import * as PainPointSolution from "~/sections/pain-point-solution";
import * as PainPointSolutionItems from "~/sections/pain-point-solution/items";
import * as PainPointSolutionItem from "~/sections/pain-point-solution/item";
import * as PromotionBadge from "~/sections/promotion-badge";
import * as FeatureTags from "~/sections/feature-tags";
import * as FeatureTagItem from "~/sections/feature-tags/item";
import * as ComparisonImages from "~/sections/comparison-images";
import * as ComparisonImagesItem from "~/sections/comparison-images/item";
import * as BackToTop from "~/sections/back-to-top";
import * as Copyright from "~/sections/copyright";
import * as Product360View from "~/sections/product-360-view";
import * as Product360ViewItem from "~/sections/product-360-view/item";
import * as InteractiveProduct360 from "~/sections/interactive-product-360";
import * as InteractiveProduct360Item from "~/sections/interactive-product-360/item";
import * as SatisfactionGuarantee from "~/sections/satisfaction-guarantee";
import * as SatisfactionGuaranteeFeature from "~/sections/satisfaction-guarantee/feature";
import * as SatisfactionGuaranteeReview from "~/sections/satisfaction-guarantee/review-item";
import * as StickyNavigation from "~/sections/sticky-navigation";
import * as ProductInfo from "~/sections/product-info";
import * as ProductInfoItem from "~/sections/product-info/item";
import * as Checkout from "~/sections/checkout";
import * as CheckoutLeftBox from "~/sections/checkout/left-box";
import * as CheckoutRightBox from "~/sections/checkout/right-box";
import * as CheckoutProductItem from "~/sections/checkout/product-item";
import * as CheckoutOrderSummary from "~/sections/checkout/order-summary";
import * as CheckoutShippingProtection from "~/sections/checkout/shipping-protection";
import * as CheckoutPaymentMethods from "~/sections/checkout/payment-methods";
import * as CheckoutPaymentMethodItem from "~/sections/checkout/payment-method-item";
import * as CheckoutPaymentSecurity from "~/sections/checkout/payment-security";
import * as CheckoutSecurityLogoItem from "~/sections/checkout/security-logo-item";
import * as CheckoutOtherPaymentMethods from "~/sections/checkout/other-payment-methods";
import * as CheckoutPaymentLogoItem from "~/sections/checkout/payment-logo-item";
import * as CheckoutMoneyBackGuarantee from "~/sections/checkout/money-back-guarantee";

export const components: HydrogenComponent[] = [
  SubHeading,
  Heading,
  Paragraph,
  Link,
  // AliReview,
  // AliReviewList,
  AllProducts,
  FeaturedCollections,
  FeaturedCollectionItems,
  BlogPost,
  Blogs,
  Page,
  VideoEmbed,
  VideoEmbedItem,
  HeroImage,
  ImageWithText,
  ImageWithTextContent,
  ImageWithTextImage,
  ColumnsWithImages,
  ColumnsWithImagesItems,
  ColumnWithImageItem,
  HeroVideo,
  MapSection,
  PromotionGrid,
  PromotionGridItem,
  PromotionGridButtons,
  Hotspots,
  HotspotsItem,
  Countdown,
  CountDownTimer,
  NewsLetter,
  NewsLetterForm,
  Blogs,
  BlogPost,
  AllProducts,
  FeaturedProducts,
  FeaturedProductItems,
  Testimonial,
  TestimonialItems,
  TestimonialItem,
  TestimonialItemV2,
  ImageGallery,
  ImageGalleryItems,
  ImageGalleryItem,
  MainProduct,
  ProductBreadcrumb,
  ProductBadges,
  ProductVendor,
  ProductTitle,
  ProductPrices,
  ProductSummary,
  ProductBundledVariants,
  ProductVariantSelector,
  ProductQuantitySelector,
  ProductATCButtons,
  ProductCollapsibleDetails,
  RelatedProducts,
  RelatedArticles,
  CollectionFilters,
  CollectionList,
  CollectionListItems,
  SingleProduct,
  JudgemeStarsRating,
  JudgemeReview,
  JudgemeReviewSummary,
  JudgemeReviewList,
  OurTeam,
  OurTeamMembers,
  SlideShow,
  SlideShowSlide,
  Spacer,
  StockAlert,
  PromotionBanner,
  PromotionBannerItem,
  FAQ,
  FAQItems,
  FAQItem,
  FeatureIcons,
  FeatureIconsGrid,
  FeatureIconsItem,
  FeatureComparison,
  FeatureComparisonTable,
  FeatureComparisonTableItem,
  ProductSpecifications,
  ProductSpecificationsList,
  ProductSpecificationsItem,
  PainPointSolution,
  PainPointSolutionItems,
  PainPointSolutionItem,
  PromotionBadge,
  FeatureTags,
  FeatureTagItem,
  ComparisonImages,
  ComparisonImagesItem,
  PromotionButton,
  BackToTop,
  Copyright,
  Product360View,
  Product360ViewItem,
  InteractiveProduct360,
  InteractiveProduct360Item,
    SatisfactionGuarantee,
    SatisfactionGuaranteeFeature,
    SatisfactionGuaranteeReview,
    StickyNavigation,
    ProductInfo,
    ProductInfoItem,
    Checkout,
    CheckoutLeftBox,
    CheckoutRightBox,
    CheckoutProductItem,
    CheckoutOrderSummary,
    CheckoutShippingProtection,
    CheckoutPaymentMethods,
    CheckoutPaymentMethodItem,
    CheckoutPaymentSecurity,
    CheckoutSecurityLogoItem,
    CheckoutOtherPaymentMethods,
    CheckoutPaymentLogoItem,
    CheckoutMoneyBackGuarantee,
  ];
