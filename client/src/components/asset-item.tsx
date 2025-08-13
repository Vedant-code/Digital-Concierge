import { type Asset } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface AssetItemProps {
  asset: Asset;
}

const iconColors = {
  "fas fa-file-text": "bg-primary bg-opacity-10 text-primary",
  "fas fa-concierge-bell": "bg-blue-100 text-blue-600",
  "fas fa-image": "bg-green-100 text-accent",
  "fas fa-clipboard-list": "bg-yellow-100 text-warning",
  "fas fa-map-marker-alt": "bg-purple-100 text-purple-600",
};

const tagColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
];

export function AssetItem({ asset }: AssetItemProps) {
  const iconColorClass = iconColors[asset.icon as keyof typeof iconColors] || "bg-primary bg-opacity-10 text-primary";

  const handleSelect = () => {
    // TODO: Implement asset selection logic
    console.log("Selected asset:", asset.title);
  };

  return (
    <div 
      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
      onClick={handleSelect}
      data-testid={`asset-${asset.id}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${iconColorClass}`}>
          <i className={`${asset.icon} text-sm`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate" data-testid="asset-title">
            {asset.title}
          </p>
          {asset.description && (
            <p className="text-xs text-neutral truncate" data-testid="asset-description">
              {asset.description}
            </p>
          )}
          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {asset.tags.map((tag, index) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`text-xs px-2 py-0.5 ${tagColors[index % tagColors.length]}`}
                  data-testid={`tag-${tag}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
